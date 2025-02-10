import {
  faCheck,
  faCheckCircle,
  faCircle,
  faO,
  faSpinner,
  faThumbsUp,
  faWarning,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

interface MarkProps extends React.HTMLAttributes<HTMLDivElement> {}

const IdleMark = (props?: MarkProps): JSX.Element => (
  <StatusMarkBox {...props}></StatusMarkBox>
);

const LoadingMark = (props?: MarkProps): JSX.Element => (
  <StatusMarkBox {...props}>
    <FontAwesomeIcon
      icon={faSpinner}
      className="fa-spin"
      style={{ color: '#429be4' }}
    />
  </StatusMarkBox>
);
const OkMark = (props?: MarkProps): JSX.Element => (
  <StatusMarkBox {...props}>
    <FontAwesomeIcon icon={faO} style={{ color: '#10c027' }} />
  </StatusMarkBox>
);
const CheckCircleMark = (props?: MarkProps): JSX.Element => (
  <StatusMarkBox {...props}>
    <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#f0f0f0' }} />
  </StatusMarkBox>
);
const SuccessMark = (props?: MarkProps): JSX.Element => (
  <StatusMarkBox {...props}>
    <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#10c027' }} />
  </StatusMarkBox>
);
const FailMark = (props?: MarkProps): JSX.Element => (
  <StatusMarkBox {...props}>
    <FontAwesomeIcon
      icon={faXmarkCircle}
      style={{ color: '#c91010', fontSize: '18px' }}
    />
  </StatusMarkBox>
);
const WarnMark = (props?: MarkProps): JSX.Element => (
  <StatusMarkBox {...props}>
    <FontAwesomeIcon icon={faWarning} style={{ color: '#f0ad4e' }} />
  </StatusMarkBox>
);

const StatusMarkBox = styled.div`
  margin-left: 10px;
  height: 100%;
  font-size: 16px;
  box-sizing: border-box;
`;

export {
  IdleMark,
  LoadingMark,
  SuccessMark,
  FailMark,
  WarnMark,
  OkMark,
  CheckCircleMark,
};
