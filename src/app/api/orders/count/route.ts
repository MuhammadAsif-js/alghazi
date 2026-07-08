import { NextRequest } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Server-Sent Events endpoint — streams the live order count every 5 seconds.
 * Clients connect with: const es = new EventSource('/api/orders/count');
 */
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (count: number) => {
        const data = `data: ${JSON.stringify({ count })}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      // Send immediately on connect
      try {
        const count = await prisma.order.count();
        send(count);
      } catch {
        send(0);
      }

      // Then send every 5 seconds
      const interval = setInterval(async () => {
        try {
          if (req.signal.aborted) {
            clearInterval(interval);
            controller.close();
            return;
          }
          const count = await prisma.order.count();
          send(count);
        } catch {
          send(0);
        }
      }, 5000);

      // Clean up when client disconnects
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
