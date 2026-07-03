import Link from 'next/link';

const WHATSAPP_NUMBER = '923084382626';

export default function Footer() {
  return (
    <footer className="bg-[#1C1917] text-stone-400 py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">AG</span>
              </div>
              <div>
                <p className="font-serif text-white font-bold text-lg leading-none">AL GHAZI</p>
                <p className="text-[10px] text-stone-500 tracking-widest uppercase mt-0.5">Wood Crafts & Interior</p>
              </div>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Handcrafted premium wood products. Made with passion in Pakistan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Navigate</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-stone-400 hover:text-white transition-colors">
                  Our Collection
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-sm text-stone-400 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-400 hover:text-[#25D366] transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Get In Touch</h4>
            <div className="space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors"
              >
                <span className="text-[#25D366]">●</span> WhatsApp: +92 308-4382626
              </a>
              <p className="text-sm text-stone-500">
                <span className="text-amber-500">●</span> Banking: Meezan Bank & Easypaisa
              </p>
              <p className="text-sm text-stone-500">
                <span className="text-stone-600">●</span> Nationwide COD Delivery
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} AL GHAZI WOOD CRAFTS. Masterfully Crafted in Pakistan.
          </p>
          <Link
            href="/admin"
            className="text-[10px] text-stone-700 hover:text-stone-400 transition-colors uppercase tracking-widest"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
