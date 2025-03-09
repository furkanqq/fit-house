// "use client";
// "use client";

// import { useState } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";

// export default function ScannerPage() {
//   const [scannedData, setScannedData] = useState<string | null>(null);
//   const [pause, setPause] = useState(false);

//   // Yeni ses dosyasını tanımlıyoruz
//   const [audio] = useState(new Audio("/welcome1.mp3")); // Buraya kendi ses dosyanızın yolunu koyabilirsiniz.

//   // QR kodu okunduğunda ses çalma
//   const handleScan = (data: string) => {
//     setPause(true);
//     setScannedData(data);
//     audio.play(); // QR kodu okunduğunda ses çal
//     setPause(false);
//   };

//   return (
//     <div>
//       <div>
//         <h3>Scanned Data: {scannedData}</h3>
//       </div>

//       <Scanner
//         formats={["qr_code"]}
//         onScan={(detectedCodes) => {
//           if (detectedCodes.length > 0) {
//             handleScan(detectedCodes[0].rawValue);
//           }
//         }}
//         onError={(error) => console.log(`onError: ${error}`)}
//         styles={{ container: { height: "400px", width: "350px" } }}
//         components={{
//           audio: false, // Varsayılan sesi devre dışı bırakıyoruz
//           onOff: false,
//           torch: true,
//           zoom: true,
//           finder: true,
//         }}
//         allowMultiple={true}
//         scanDelay={5000}
//         paused={pause}
//       />
//     </div>
//   );
// }
