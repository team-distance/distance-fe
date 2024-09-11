import styled from 'styled-components';

const MBTI = ({ mbti, color }) => {
  return (
    <MBTITag $color={color}>
      <Tail $color={color} />
      {mbti}
    </MBTITag>
  );
};

const MBTITag = styled.div`
  position: absolute;
  top: 75%;
  left: 90%;
  transform: translateX(-50%);
  text-align: center;
  padding: 2px 8px;
  background-color: ${(props) => props.$color};
  color: #ffffff;
  white-space: nowrap;
  border-radius: 2rem;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Tail = styled(({ $color, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15.6"
    height="9.1"
    viewBox="0 0 12 7"
    fill="none"
    {...props}
  >
    <path
      d="M0.973418 0.041635C0.44389 -0.484733 -0.308475 4.11916 2.92822 6.03271H11.9282C5.60409 4.71229 1.50295 0.568003 0.973418 0.041635Z"
      fill={$color}
    />
  </svg>
))`
  position: absolute;
  top: -6px;
  left: 37%;
  transform: translateX(-50%);
`;

export default MBTI;
