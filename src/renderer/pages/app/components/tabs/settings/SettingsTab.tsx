import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { RootState, useAppDispatch } from '@app/store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSave } from '@fortawesome/free-solid-svg-icons';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  isValidKeyFormat,
  PREFERENCE_KEY_VALID_CONDITION_MESSAGE,
} from '../../../common/PreferKeyUtils';
import { validatePreferenceKey } from '../../../store/slices/live/option/fixtureLiveOptionThunk';
import { persistPreferenceKey } from '../../../store/slices/live/option/preferenceKeyIO';
import {
  FailMark,
  IdleMark,
  LoadingMark,
  SuccessMark,
  ThumbsUpMark,
  WarnMark,
} from '@src/renderer/global/style/StatusIcon';
import { Tooltip } from 'react-tooltip';
import { RequestStatus } from '../../../store/slices/live/option/fixtureLiveOptionSlice';

type InputKeyType = 'password' | 'text';

const SettingsTab = () => {
  const dispatch = useAppDispatch();
  const preferenceKey = useSelector(
    (state: RootState) => state.fixtureLiveOption.preference.key,
  );
  const isValidKey = useSelector(
    (state: RootState) => state.fixtureLiveOption.preference.isValid,
  );
  const validateStatus = useSelector(
    (state: RootState) => state.fixtureLiveOption.preference.status,
  );
  const [inputKey, setInputKey] = useState(preferenceKey);
  const [inputKeyType, seyInputKeyType] = useState<InputKeyType>('password');
  const [NotValidPrefKeyInput, setNotValidPrefKeyInput] = useState(false);
  const [diffInputAndSavedKey, setDiffInputAndSavedKey] = useState(false);

  useEffect(() => {
    setInputKey(preferenceKey);
  }, [preferenceKey]);

  useEffect(() => {
    setDiffInputAndSavedKey(preferenceKey !== inputKey);
  }, [preferenceKey, inputKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setInputKey(key);

    if (isValidKeyFormat(key)) {
      setNotValidPrefKeyInput(false);
    } else {
      setNotValidPrefKeyInput(true);
    }
  };

  const toggleKeyInputType = () => {
    seyInputKeyType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  const onClickValidateAndSave = useCallback(() => {
    if (!isValidKeyFormat(inputKey)) {
      return;
    }

    dispatch(persistPreferenceKey(inputKey));
    dispatch(validatePreferenceKey(inputKey));
  }, [dispatch, inputKey]);

  return (
    <>
      <Container>
        <PreferenceGroup>
          <Title>속성키</Title>
          <KeyBox>
            <KeyInputWrapper>
              <KeyInput
                value={inputKey}
                onChange={handleInputChange}
                type={inputKeyType}
              />
              <KeyInputTypeToggle onClick={toggleKeyInputType}>
                <FontAwesomeIcon
                  icon={inputKeyType === 'password' ? faEyeSlash : faEye}
                />
              </KeyInputTypeToggle>
            </KeyInputWrapper>
            {inputValidateIcon(NotValidPrefKeyInput)}
          </KeyBox>
          <SubBox>
            <SubBoxTitle data-tooltip-content={'hello'}>
              검증 및 저장
            </SubBoxTitle>
            <ValidateAndSaveButton onClick={onClickValidateAndSave}>
              <FontAwesomeIcon icon={faSave} />
            </ValidateAndSaveButton>
            <KeyValidateStatusWrapper>
              {validateIcon(validateStatus, isValidKey, diffInputAndSavedKey)}
            </KeyValidateStatusWrapper>
          </SubBox>
        </PreferenceGroup>
      </Container>

      <Tooltip id="input-validate-tooltip" place="right" />
      <Tooltip id="status-tooltip" place="right" />
    </>
  );
};

export default SettingsTab;

const inputValidateIcon = (NotValidPrefKeyInput: boolean) => {
  const COMMON_MARGIN = { style: { marginTop: '5px' } };
  if (NotValidPrefKeyInput) {
    return (
      <WarnMark
        {...COMMON_MARGIN}
        data-tooltip-id="input-validate-tooltip"
        data-tooltip-html={renderToStaticMarkup(
          <div>
            속성키 형식이 올바르지 않습니다. <br />
            {PREFERENCE_KEY_VALID_CONDITION_MESSAGE}
          </div>,
        )}
      />
    );
  } else {
    return (
      <ThumbsUpMark
        {...COMMON_MARGIN}
        data-tooltip-id="input-validate-tooltip"
        data-tooltip-content="속성키 형식이 올바릅니다"
      />
    );
  }
};

const DEBUG = false;
const validateIcon = (
  validateStatus: RequestStatus,
  isValidKey: boolean | null,
  diffInputAndSavedKey: boolean,
) => {
  if (DEBUG) {
    return (
      <LoadingMark
        data-tooltip-id="status-tooltip"
        data-tooltip-content="응답 대기중"
      />
    );
  }
  if (diffInputAndSavedKey) {
    return (
      <WarnMark
        key={'diffInputAndSavedKey'}
        data-tooltip-id="status-tooltip"
        data-tooltip-content="변경된 속성키가 저장되지 않았습니다"
      />
    );
  }

  if (validateStatus === 'idle') {
    if (isValidKey) {
      return (
        <SuccessMark
          key={'validateStatusSuccess'}
          data-tooltip-id="status-tooltip"
          data-tooltip-content="유효한 속성키 입니다"
        />
      );
    } else {
      return (
        <IdleMark
          key={'validateStatusIdle'}
          data-tooltip-id="status-tooltip"
          data-tooltip-content="대기중"
        />
      );
    }
  } else if (validateStatus === 'loading') {
    return (
      <LoadingMark
        key={'validateStatusLoading'}
        data-tooltip-id="status-tooltip"
        data-tooltip-content="응답 대기중"
      />
    );
  } else if (validateStatus === 'success') {
    return (
      <SuccessMark
        key={'validateStatusSuccess'}
        data-tooltip-id="status-tooltip"
        data-tooltip-content="유효한 속성키 입니다"
      />
    );
  }
  return (
    <FailMark
      key={'validateStatusFailed'}
      data-tooltip-id="status-tooltip"
      data-tooltip-content="유효하지 않은 속성키 입니다"
    />
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px;
  box-sizing: border-box;
`;

const PreferenceGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  box-sizing: border-box;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 5px;
  box-sizing: border-box;
`;

const KeyBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
`;

const KeyInputWrapper = styled.div`
  position: relative;
  margin-top: 5px;
  height: 40px;
  width: 250px;
  box-sizing: border-box;
`;

const KeyInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: black;
  color: white;

  border-radius: 10px;
  padding: 5px 15px;
  padding-left: 15px;
  padding-right: 35px;
  font-size: 14px;
  font-weight: 400;

  border: none;
`;

const KeyInputTypeToggle = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);

  padding: 0;
  font-size: 14px;
  font-weight: 400;
  background-color: transparent;
  color: #999999;

  &:hover {
    scale: 1;
    transform: translate(0, -50%);
  }
`;

const SubBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-left: 10px;
`;

const SubBoxTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-right: 10px;
  box-sizing: border-box;
`;

const KeyValidateStatusWrapper = styled.div`
  margin-top: 5px;
  height: 20px;
  box-sizing: border-box;
`;

const CommonButtonCss = css`
  padding: 0;

  width: 40px;
  height: 30px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #5934e0;
  color: #ffffff;

  &:hover {
    background-color: #5e35f1;
    color: #ffffff;
    transform: none;
  }
`;

const ValidateAndSaveButton = styled.button`
  ${CommonButtonCss}
`;

const SaveButton = styled.button`
  ${CommonButtonCss}
`;
