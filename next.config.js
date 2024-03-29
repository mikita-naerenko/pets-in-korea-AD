/** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         domains: ["res.cloudinary.com"]
//       }
// }
// http://localhost:3001

const nextConfig = {
  async headers() {
      return [
          {
              // matching all API routes
              source: "/api/public/:path*",
              headers: [
                  { key: "Access-Control-Allow-Credentials", value: "true" },
                  { key: "Access-Control-Allow-Origin", value: "https://pets-in-korea.com" }, // replace this your actual origin
                  { key: "Access-Control-Allow-Methods", value: "OPTIONS, GET, DELETE, PATCH, POST, PUT" },
                  { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
              ]
          }
      ]
  },
  images: {
    domains: ["res.cloudinary.com"]
  }
}

module.exports = nextConfig


