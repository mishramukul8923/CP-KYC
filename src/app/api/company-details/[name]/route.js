// import { NextResponse } from "next/server";

// const BASE_URL = "http://139.84.168.36:8000";

// export async function GET(request, { params }) {
//   try {
//     const name = params?.name;
//     if (!name) {
//       return NextResponse.json(
//         { error: "Missing company name." },
//         { status: 400 }
//       );
//     }

//     let normalizedName = name;
//     try {
//       normalizedName = decodeURIComponent(name);
//     } catch {
//       normalizedName = name;
//     }

//     const incomingAuth = request.headers.get("authorization");
//     const headers = {};

//     if (incomingAuth) {
//       headers.Authorization = incomingAuth;
//     }

//     const upstreamResponse = await fetch(
//       `${BASE_URL}/api/company-details/${encodeURIComponent(normalizedName)}`,
//       { headers, cache: "no-store" }
//     );

//     const contentType = upstreamResponse.headers.get("content-type") || "";

//     if (contentType.includes("application/json")) {
//       const json = await upstreamResponse.json();
//       return NextResponse.json(json, { status: upstreamResponse.status });
//     }

//     const text = await upstreamResponse.text();
//     return new NextResponse(text, {
//       status: upstreamResponse.status,
//       headers: { "content-type": contentType || "text/plain" },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Company details not available", details: String(error) },
//       { status: 500 }
//     );
//   }
// }
