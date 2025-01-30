import {
  faCheck,
  faSpinner,
  faWarning,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const IdleMark = () => {
  return <StatusMarkBox />;
};

const LoadingMark = () => {
  return (
    <StatusMarkBox>
      <FontAwesomeIcon
        icon={faSpinner}
        className="fa-spin"
        style={{ color: '#429be4' }}
      />
    </StatusMarkBox>
  );
};

const SuccessMark = () => {
  return (
    <StatusMarkBox>
      <FontAwesomeIcon icon={faCheck} style={{ color: '#10c027' }} />
    </StatusMarkBox>
  );
};

const FailMark = () => {
  return (
    <StatusMarkBox>
      <FontAwesomeIcon
        icon={faXmark}
        style={{ color: '#c91010', fontSize: '18px' }}
      />
    </StatusMarkBox>
  );
};

const WarnMark = () => {
  return (
    <StatusMarkBox>
      <FontAwesomeIcon icon={faWarning} style={{ color: '#f0ad4e' }} />
    </StatusMarkBox>
  );
};

const StatusMarkBox = styled.div`
  margin-left: 10px;
  height: 100%;
  font-size: 16px;
  box-sizing: border-box;
`;

export { IdleMark, LoadingMark, SuccessMark, FailMark, WarnMark };
