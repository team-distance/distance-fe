import { Toaster } from 'react-hot-toast';

const GlobalToastContainer = () => {
    return (
      //   <Toaster
      //   toastOptions={{
      //     style: {
      //       fontSize: '14px',
      //     },
      //   }}
      // />
      <Toaster
        containerStyle={{
          bottom: 104,
        }}
        toastOptions={{
          style: {
            fontSize: '14px',
          },
        }}
      />
    )
}

export default GlobalToastContainer;