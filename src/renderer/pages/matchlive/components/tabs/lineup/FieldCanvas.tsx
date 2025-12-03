import React, { useEffect, useRef } from 'react';
import { GlobalBorderRadiusPx } from '@matchlive/components/common/StyleConstant';
import styled from 'styled-components';

const FootballFieldCanvasStyle = styled.canvas`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -9999;
  border-radius: ${GlobalBorderRadiusPx}px;
`;

const FieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldColor = '#008cff97';
  const fieldLineColor = '#dbe7fa39';
  const lineWidth = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Canvas 크기를 부모 요소에 맞추기
        const width = canvas.width;
        const height = canvas.height;
        const outLineOffset = 50;

        // 배경 색상 설정 (초록색 잔디)
        ctx.fillStyle = fieldColor;
        ctx.fillRect(0, 0, width, height);

        // 골라인과 터치라인
        ctx.strokeStyle = fieldLineColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(
          outLineOffset,
          outLineOffset,
          width - outLineOffset * 2,
          height - outLineOffset * 2
        );

        // 하프라인
        ctx.beginPath();
        ctx.moveTo(outLineOffset, height / 2);
        ctx.lineTo(width - outLineOffset, height / 2);
        ctx.stroke();

        // 센터 서클
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, height / 11, 0, Math.PI * 2, false);
        ctx.stroke();

        // 패널티 박스 (위쪽)
        const penaltyBoxWidth = width / 2.5;
        const penaltyBoxHeight = penaltyBoxWidth / 3;
        ctx.strokeRect(
          (width - penaltyBoxWidth) / 2,
          outLineOffset,
          penaltyBoxWidth,
          penaltyBoxHeight
        );

        // 패널티 박스 (아래쪽)
        ctx.strokeRect(
          (width - penaltyBoxWidth) / 2,
          height - penaltyBoxHeight - outLineOffset,
          penaltyBoxWidth,
          penaltyBoxHeight
        );

        // 골대 (위쪽)
        const goalWidth = width / 6;
        const goalDepth = 10;
        ctx.strokeRect(
          (width - goalWidth) / 2,
          -goalDepth + outLineOffset,
          goalWidth,
          goalDepth
        );

        // 골대 (아래쪽)
        ctx.strokeRect(
          (width - goalWidth) / 2,
          height - outLineOffset,
          goalWidth,
          goalDepth
        );

        // 패널티 아크 (위쪽)
        ctx.beginPath();
        ctx.arc(
          width / 2,
          penaltyBoxHeight + outLineOffset,
          penaltyBoxHeight / 2,
          Math.PI * 0,
          Math.PI * 1,
          false
        );
        ctx.stroke();

        // 패널티 아크 (아래쪽)
        ctx.beginPath();
        ctx.arc(
          width / 2,
          height - penaltyBoxHeight - outLineOffset,
          penaltyBoxHeight / 2,
          Math.PI * 1,
          Math.PI * 0,
          false
        );
        ctx.stroke();
      }
    }
  }, []);

  return (
    <FootballFieldCanvasStyle
      ref={canvasRef}
      width="1000" // 기본 캔버스 너비
      height="2000" // 기본 캔버스 높이 (세로 길이를 더 길게 설정)
    />
  );
};

export default FieldCanvas;
