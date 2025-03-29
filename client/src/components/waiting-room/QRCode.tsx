import { useEffect } from 'react';
import qr from 'qrcode';

type QRCodeProps = {
  joinCode: string;
};

export const QRCode = ({ joinCode }: QRCodeProps) => {
  useEffect(
    () =>
      qr.toCanvas(
        document.getElementById(joinCode),
        'http://localhost:5173/' + joinCode,
        { margin: 1, scale: 3 },
        (error) => {
          if (error) console.error(error);
        }
      ),
    [joinCode]
  );

  return (
    <div className="flex flex-col items-center font-bold">
      <h2 className="mb-3">Invite your friends!</h2>
      <canvas id={joinCode} />
      <p className="uppercase tracking-widest text-lg">{joinCode}</p>
    </div>
  );
};
