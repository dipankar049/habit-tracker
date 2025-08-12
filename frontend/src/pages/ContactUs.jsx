import { Mail, Github, Linkedin, Twitter } from "lucide-react";

export default function ContactUs() {
  const contactLinks = [
    {
      icon: <Mail className="w-6 h-6 text-red-500" />,
      label: "Email",
      href: "mailto:yourname@gmail.com",
      color: "hover:text-red-600",
    },
    {
      icon: <Github className="w-6 h-6 text-gray-800 dark:text-white" />,
      label: "GitHub",
      href: "https://github.com/yourusername",
      color: "hover:text-gray-600",
    },
    {
      icon: <Linkedin className="w-6 h-6 text-blue-600" />,
      label: "LinkedIn",
      href: "https://linkedin.com/in/yourusername",
      color: "hover:text-blue-700",
    },
    {
      icon: <Twitter className="w-6 h-6 text-sky-500" />,
      label: "Twitter",
      href: "https://twitter.com/yourusername",
      color: "hover:text-sky-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Got questions, feedback, or suggestions? Reach out to us via any of these platforms.
        </p>
        <div className="flex flex-col gap-4">
          {contactLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 transition-all duration-200 ${link.color} hover:scale-105`}
            >
              {link.icon}
              <span className="font-medium text-gray-800 dark:text-white">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
