import type { AppProps } from 'next/app';
import '../app/globals.css'; // adjust path if needed

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;


// import type { AppProps } from "next/app";
// import "../app/globals.css";
// import { useEffect } from "react";
// import { useRouter } from "next/router";

// function MyApp({ Component, pageProps }: AppProps) {
//   const router = useRouter();

//   useEffect(() => {
//     // Only runs client-side
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       // Redirect to login if not logged in
//       router.push("/login/login");
//     }
//   }, [router]);

//   return <Component {...pageProps} />;
// }

// export default MyApp;
