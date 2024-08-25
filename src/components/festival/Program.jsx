import styled from 'styled-components';
import ProgramCard from './ProgramCard';
import { useEffect, useState } from 'react';
import { instance } from '../../api/instance';
import { UNIV_STATE } from '../../constants/collegeState';
import Loader from '../common/Loader';

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
        if (Array.isArray(res.data)) setSchool('동국대학교');
        else {
          UNIV_STATE.forEach((univ) => {
            if (res.data.includes(univ.id)) setSchool(univ.name);
          });
        }
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
        // console.log(res.data);
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
        <Loader />
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
