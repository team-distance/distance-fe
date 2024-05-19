import styled from 'styled-components';
import ProgramCard from './ProgramCard';
import { useEffect, useState } from 'react';
import { instance } from '../../api/instance';
import ClipLoader from 'react-spinners/ClipLoader';
import { UNIV_STATE } from '../../constants/collegeState';

const Program = () => {
  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState('');

  useEffect(() => {
    const getDomain = async () => {
      try {
        const res = await instance.get('/univ/check/univ-domain');
        UNIV_STATE.map((univ) => {
          if (res.data.includes(univ.id)) setSchool(univ.name);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getDomain();
  }, []);

  useEffect(() => {
    const fetchProgramInfo = async () => {
      try {
        setLoading(true);
        const res = await instance.get(`/performance?school=${school}`);
        setProgramList(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgramInfo();
  }, [school]);

  return (
    <>
      {loading ? (
        <LoaderContainer>
          <ClipLoader color={'#FF625D'} loading={loading} size={50} />
        </LoaderContainer>
      ) : (
        <>
          <Title>{school}</Title>
          <Date>5월 7일</Date>
          <WrapCards>
            {programList.map(
              (program) =>
                program.startAt.startsWith('2024-05-07') && (
                  <ProgramCard key={program.artistId} content={program} />
                )
            )}
          </WrapCards>
          <Date className="cardsDate">5월 8일</Date>
          <WrapCards>
            {programList.map(
              (program) =>
                program.startAt.startsWith('2024-05-08') && (
                  <ProgramCard key={program.artistId} content={program} />
                )
            )}
          </WrapCards>
          <Date className="cardsDate">5월 9일</Date>
          <WrapCards>
            {programList.map(
              (program) =>
                program.startAt.startsWith('2024-05-09') && (
                  <ProgramCard key={program.artistId} content={program} />
                )
            )}
          </WrapCards>
        </>
      )}
    </>
  );
};
export default Program;

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

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
