import styled from 'styled-components';

const LineupTabContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  -webkit-app-region: drag;
  /* background-color: #000000f9; */
  /* background-color: red; */
  padding-top: 12px;
  padding-bottom: 5px;
`;

const TeamContainer = styled.div<{ isAway?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  overflow: hidden;
  flex-direction: ${({ isAway }) => {
    return isAway ? 'column-reverse' : 'column';
  }};
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: visible;
`;

const TeamName = styled.h2`
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
  position: absolute;
`;

const GridLine = styled.div<{ height: number; isAway?: boolean }>`
  position: relative;
  width: 100%;
  height: ${(props) => props.height}%;
  display: flex;
`;

const GridPlayer = styled.div<{
  top: number;
  left: number;
  width: number;
  playerSize: number;
}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  top: 0%;
  left: ${(props) => props.left}%;
  width: ${(props) => props.width}%;
  height: ${(props) => props.playerSize}px;
  transform: translateX(-50%);

  .player-number-photo-box {
    top: 0;
    display: inline-block;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    height: ${(props) => props.playerSize - 30}px;

    img {
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: top;
    }

    .player-number {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      border-radius: 50%;
      bottom: 0;
      width: ${(props) => props.playerSize * 1.2}px;
      height: 100%;

      svg {
        height: 100%;
        width: 80%;
      }

      .player-number_val {
        position: absolute;
        box-sizing: border-box;
        text-align: center;
        bottom: 50%;
        left: 50%;
        transform: translate(-50%, 70%);
        font-size: ${(props) => props.playerSize * 0.32}px;
      }
    }
  }

  // 선수 이름
  span {
    display: inline-block;
    font-size: 20px;
    overflow-y: hidden;
    white-space: nowrap;
    margin-top: 3px;
    color: white;
  }
`;

const TeamLogoName = styled.div`
  position: absolute;
  left: 0;
  width: 30%;
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;

  .team-logo {
    width: 30px;
    height: 24px;
    margin-left: 10px;

    img {
      width: 100%;
      height: 100%;
      min-width: 30px;
      min-height: 30px;
      object-fit: contain;
    }
  }

  .team-name {
    font-size: 16px;
    font-weight: 700;
    white-space: nowrap;
    overflow-x: visible;
    margin-left: 3px;
    margin-top: 10px;
    color: beige;
  }
`;

export {
  LineupTabContainer,
  TeamContainer,
  TeamName,
  GridLine,
  GridPlayer,
  TeamLogoName,
};
