import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About DappEventX</h3>
            <p className='text-gray-300 mt-2' >
              Các thành viên nhóm thực hiện đề tài
            </p>
            <p className="text-gray-300">
              21078771 - Nguyễn Hoàng Kiệt
            </p>
            <p className="text-gray-300">
              21001545 - Đinh Việt Hoàng
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events/create" className="text-gray-300 hover:text-white transition">
                  Create Event
                </Link>
              </li>
              <li>
                <Link href="/events/personal" className="text-gray-300 hover:text-white transition">
                  My Events
                </Link>
              </li>
              <li>
                <Link href="/events/scan" className="text-gray-300 hover:text-white transition">
                  Ticket Scanner
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-2 text-gray-300">
              <p>Email: contact@dappeventx.com</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="hover:text-white transition">
                  Twitter
                </a>
                <a href="#" className="hover:text-white transition">
                  Discord
                </a>
                <a href="https://github.com/hoang1904/Web3ForAFirst" className="hover:text-white transition">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DappEventX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer