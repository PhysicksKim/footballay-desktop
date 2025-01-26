import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState, useAppDispatch } from '@app/store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';
import { isValidKeyFormat } from '../../../common/PreferKeyUtils';
import { validatePreferenceKey } from '../../../store/slices/live/option/fixtureLiveOptionThunk';
import { persistPreferenceKey } from '../../../store/slices/live/option/preferenceKeyIO';

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
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setInputKey(preferenceKey);
  }, [preferenceKey]);

  const toggleKeyInputType = () => {
    seyInputKeyType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  const debouncedValidate = React.useCallback(
    debounce((key: string) => {
      console.log('debouncedValidate', key);
      if (isValidKeyFormat(key)) {
        console.log('key is valid');
        dispatch(persistPreferenceKey(key));
        dispatch(validatePreferenceKey(key));
      } else {
        console.log('key is invalid');
        setLocalError('키는 32자이며, 대소문자와 숫자만 포함해야 합니다.');
      }
    }, 500), // 500ms 지연
    [dispatch],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setInputKey(key);
    setLocalError(null);

    if (isValidKeyFormat(key)) {
      debouncedValidate(key);
    } else {
      setLocalError('키는 32자이며, 대소문자와 숫자만 포함해야 합니다.');
    }
  };

  useEffect(() => {
    // 컴포넌트 언마운트 시 디바운스된 함수 취소
    return () => {
      debouncedValidate.cancel();
    };
  }, [debouncedValidate]);

  return (
    <Container>
      <PreferenceGroup>
        <Title>속성키</Title>
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
        <div>
          {localError && <div>{localError}</div>}
          {validateStatus === 'loading' && <div>검증 중...</div>}
          {validateStatus === 'success' && isValidKey && <div>검증 완료</div>}
          {validateStatus === 'failed' && !isValidKey && (
            <div>키 검증 실패</div>
          )}
        </div>
        <div>{`isValid? : ${isValidKey}`}</div>
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
