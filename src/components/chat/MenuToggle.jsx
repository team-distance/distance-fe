import { motion } from "framer-motion";
import styled from "styled-components";

const Path = ({open, ...props}) => (
  <motion.path
    fill="none"
    strokeWidth="3"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle, isOpen }) => (
  <WrapButton onClick={toggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        d="M 2 11.5 L 20 11.5" // 수평선
        variants={{
          closed: { d: "M 2 11.5 L 20 11.5", rotate: 0, stroke: "#DEDEDE" },
          open: { d: "M 2 11.5 L 20 11.5", rotate: 45, stroke: "#FF625D" }
        }}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
      />
      <Path
        d="M 11.5 2 L 11.5 20" // 수직선
        variants={{
          closed: { d: "M 11.5 2 L 11.5 20", rotate: 0, stroke: "#DEDEDE" },
          open: { d: "M 11.5 2 L 11.5 20", rotate: 45, stroke: "#FF625D" }
        }}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
      />
    </svg>
  </WrapButton>
);


const WrapButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  width: 2rem;
`;