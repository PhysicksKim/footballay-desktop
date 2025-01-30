import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState, useAppDispatch } from '@app/store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { debounce, set } from 'lodash';
import { isValidKeyFormat } from '../../../common/PreferKeyUtils';
import { validatePreferenceKey } from '../../../store/slices/live/option/fixtureLiveOptionThunk';
import { persistPreferenceKey } from '../../../store/slices/live/option/preferenceKeyIO';
import {
  FailMark,
  IdleMark,
  LoadingMark,
  SuccessMark,
  WarnMark,
} from '@src/renderer/global/style/StatusIcon';

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

  useEffect(() => {
    setInputKey(preferenceKey);
  }, [preferenceKey]);

  const debouncedPersistKey = useCallback(
    debounce((key: string) => {
      dispatch(persistPreferenceKey(key));
    }, 300),
    [dispatch],
  );

  useEffect(() => {
    return () => {
      debouncedPersistKey.cancel();
    };
  }, [debouncedPersistKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setInputKey(key);
    debouncedPersistKey(key);

    if (isValidKeyFormat(key)) {
      dispatch(validatePreferenceKey(key));
      setNotValidPrefKeyInput(false);
    } else {
      setNotValidPrefKeyInput(true);
    }
  };

  const toggleKeyInputType = () => {
    seyInputKeyType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  const handleInputBlur = () => {
    if (!isValidKeyFormat(inputKey)) {
      setNotValidPrefKeyInput(true);
    } else {
      setNotValidPrefKeyInput(false);
    }
  };

  const validateIcon = () => {
    if (NotValidPrefKeyInput) {
      return WarnMark();
    }

    if (validateStatus === 'idle') {
      if (isValidKey) {
        return SuccessMark();
      } else {
        return IdleMark();
      }
    } else if (validateStatus === 'loading') {
      return LoadingMark();
    } else if (validateStatus === 'success') {
      return SuccessMark();
    }
    return FailMark();
  };

  return (
    <Container>
      <PreferenceGroup>
        <Title>속성키</Title>
        <KeyBox>
          <KeyInputWrapper>
            <KeyInput
              onBlur={handleInputBlur}
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
          <KeyValidateStatusWrapper>{validateIcon()}</KeyValidateStatusWrapper>
        </KeyBox>
      </PreferenceGroup>
    </Container>
  );
};

export default SettingsTab;

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

const KeyButton = styled.button`
  box-sizing: border-box;
  width: 100px;
  height: 30px;
  background-color: black;
  color: white;
`;

const KeyValidateStatusWrapper = styled.div`
  margin-top: 5px;
  height: 20px;
  box-sizing: border-box;
`;
