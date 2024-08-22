function useSendMessageAnimation(visible) {
    const [scope, animate] = useAnimate();
  
    useEffect(() => {
      animate(
        '.message-by-me',
        {
          clipPath: visible ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 0%)',
          scale: visible ? 1 : 0,
          opacity: visible ? 1 : 0,
        },
        {
          type: 'spring',
          bounce: 0,
          duration: 0.4,
        }
      );
    }, [visible, animate]);
  
    return scope;
  }


//   const MessageBox = ({ visible, type }: MessageBoxProps) => {
//     const scope = useMenuAnimation(visible);
//     return (
//       <TextContainer $visible={visible} ref={scope}>
//         {type === 'dong' ? (
//           <MessageByMe className="message-by-me" $type={type}>
//             <div className="message-container">
//               <div className="message">
//                 <div>안녕하세요? 나리님!</div>
//               </div>
//               <div className="time">오후 3:58</div>
//             </div>
//           </MessageByMe>
//         ) : (
//           <MessageByMe className="message-by-me" $type={type}>
//             <div className="message-container">
//               <div className="message">
//                 <div>안녕하세요? 동백님!</div>
//               </div>
//               <div className="time">오후 3:58</div>
//             </div>
//           </MessageByMe>
//         )}
//       </TextContainer>
//     );
//   };


// const TextContainer = styled.div<{ $visible: boolean }>`
//   ${({ $visible }) =>
//     $visible
//       ? `
//       visibility: visible;
//           `
//       : `visibility: hidden`};
//   height: 400px;
// `;

// const MessageByMe = styled.div<{ $type: string }>`
//   margin: 16px;
//   display: flex;
//   justify-content: flex-end;
//   transform-origin: top right;

//   > .message-container {
//     display: flex;
//     flex-direction: column;
//     position: relative;
//     align-items: end;
//     justify-content: flex-end;
//     gap: 0.5rem;
//     max-width: 80%;

//     > .wrapper {
//       text-align: right;
//       font-size: 0.6rem;
//     }

//     > .message {
//       width: fit-content;
//       background-color: ${({ $type }) =>
//         $type === 'dong' ? 'var(--Primary-dong)' : 'var(--Primary-Deep-nari)'};
//       padding: 10px;

//       line-height: 1.5;
//       overflow-wrap: break-word;
//       word-break: break-word;
//       padding: 0.5rem 1rem;

//       border-radius: 0.875rem 0 0.875rem 0.875rem;
//       color: var(--Base-White, #fff);
//       font-family: NanumSquare;
//       font-size: 1.25rem;
//       font-weight: 400;
//     }

//     > .time {
//       color: var(--Base-Gray3, var(--Base-Gray, #8e8e8e));
//       text-align: center;
//       font-family: NanumSquare;
//       font-size: 1.125rem;
//       font-style: normal;
//       font-weight: 400;
//       line-height: normal;
//     }
//   }
// `;
