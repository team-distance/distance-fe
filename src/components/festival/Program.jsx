import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ProgramCard from './ProgramCard';
import { useEffect, useState } from 'react';
import { instance } from '../../api/instance';

const Title = styled.div`
  font-size: 36px;
  font-weight: 700;
`;
const Date = styled.div`
  font-size: 1rem;
  font-weight: 600;
  padding: 1.5rem 0 0.8rem 0;
`;
const WrapCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Program = () => {
  const [programList, setProgramList] = useState([]);

  const fetchProgramInfo = async () => {
    let school = '순천향대학교';
    try {
      const res = await instance.get(`/performance?school=${school}`);
      setProgramList(res.data);
      console.log('res', res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProgramInfo();
  }, []);

  return (
    <>
      <Title>순천향대학교</Title>
      <Date>5월 7일</Date>
      <WrapCards>
        {programList.map(
          (program) =>
            program.startAt.startsWith('2024-05-07') && (
              <ProgramCard content={program} />
            )
        )}
      </WrapCards>
      <Date className="cardsDate">5월 8일</Date>
      <WrapCards>
        {programList.map(
          (program) =>
            program.startAt.startsWith('2024-05-08') && (
              <ProgramCard content={program} />
            )
        )}
      </WrapCards>
      <Date className="cardsDate">5월 9일</Date>
      <WrapCards>
        {programList.map(
          (program) =>
            program.startAt.startsWith('2024-05-09') && (
              <ProgramCard content={program} />
            )
        )}
      </WrapCards>
    </>
  );
};
export default Program;
