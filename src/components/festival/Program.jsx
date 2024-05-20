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
  const [sortedList, setSortedList] = useState([]);
  const dateList = new Set();

  useEffect(() => {
    const getDomain = async () => {
      try {
        const res = await instance.get('/univ/check/univ-domain');
        UNIV_STATE.forEach((univ) => {
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
      if (school === '') return;
      try {
        setLoading(true);
        const res = await instance.get(`/performance?school=${school}`);
        setProgramList(res.data);
        res.data.forEach((date) => dateList.add(date.startAt.split('T')[0]));
        setSortedList(
          [...dateList].sort((a, b) => new window.Date(a) - new window.Date(b))
        );
        // console.log(sortedList);
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
          {sortedList &&
            sortedList.map((date) => (
              <div key={date}>
                <Date>
                  {date.split('-')[1]}월 {date.split('-')[2]}일
                </Date>
                <WrapCards>
                  {programList.map(
                    (program) =>
                      program.startAt.startsWith(date) && (
                        <ProgramCard key={program.artistId} content={program} />
                      )
                  )}
                </WrapCards>
              </div>
            ))}
          <br />
          <br />
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
  margin-bottom: 1rem;
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
