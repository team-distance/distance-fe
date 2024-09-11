import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Radio from '../common/Radio';
import { useRecoilState } from 'recoil';
import { matchingConfigState } from '../../store/matchingConfig';
import Slider from '../home/Slider';

const MatchingConfigBottomsheet = ({ closeModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [matchingConfig, setMatchingConfig] =
    useRecoilState(matchingConfigState);

  const [selectedOption, setSelectedOption] = useState(
    matchingConfig.isPermitOtherSchool
  );

  const [searchRange, setSearchRange] = useState(matchingConfig.searchRange);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value === 'true' ? true : false);
  };

  const handleRangeChange = (event) => {
    const range = Number(event.target.value);

    // range가 0이면 1000으로 설정

    // setSearchRange(!range ? 1000 : range);
    setSearchRange(500000);
  };

  const handleSave = () => {
    setMatchingConfig({
      isPermitOtherSchool: selectedOption,
      searchRange: searchRange,
    });
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <Bottomsheet $isOpen={isOpen}>
      <Title>거리 조정</Title>

      <Form>
        <RadioGroup>
          <Radio
            type="radio"
            name="campusOption"
            id="onCampus"
            value={false}
            checked={selectedOption === false}
            onChange={handleOptionChange}
          >
            우리 학교만 매칭하기
          </Radio>

          <Radio
            type="radio"
            name="campusOption"
            id="offCampus"
            value={true}
            checked={selectedOption === true}
            onChange={handleOptionChange}
          >
            다른 학교 학생도 함께 매칭하기
          </Radio>
        </RadioGroup>

        <Slider value={searchRange} onChange={handleRangeChange} />

        <ButtonGroup>
          <CancelButton type="button" onClick={closeModal}>
            취소하기
          </CancelButton>
          <SaveButton
            type="button"
            onClick={() => {
              handleSave();
              closeModal();
            }}
          >
            적용하기
          </SaveButton>
        </ButtonGroup>
      </Form>
    </Bottomsheet>
  );
};

export default MatchingConfigBottomsheet;

const Bottomsheet = styled.div`
  position: fixed;
  display: grid;
  gap: 24px;
  bottom: ${(props) => (props.$isOpen ? 0 : '-40%')};
  width: 100%;
  box-sizing: border-box;
  padding: 32px;
  background: white;
  border-radius: 30px 30px 0 0;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  transition: bottom 0.3s cubic-bezier(0, 0.45, 0.45, 1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 28px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  gap: 8px;
`;

const CancelButton = styled.button`
  width: 100%;
  background-color: #f3f3f3;
  padding: 5px 53px;
  border: none;
  border-radius: 12px;

  color: #000000;
  font-size: 10px;
  font-weight: 300;
  line-height: 22px;
`;

const SaveButton = styled.button`
  width: 100%;
  background-color: #ff625d;
  padding: 5px 53px;
  border: none;
  border-radius: 12px;

  color: #ffffff;
  font-size: 10px;
  font-weight: 500;
  line-height: 22px;
`;
