import styled from 'styled-components';

const Report = ({ reportCount }) => {
  return <WrapReport>신고 누적 2회</WrapReport>;
};

const WrapReport = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  border-radius: 0rem 0.75rem;
  background: #ff4646;
  padding: 4px 6px;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 0.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export default Report;
