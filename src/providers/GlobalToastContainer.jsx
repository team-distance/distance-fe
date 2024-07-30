import { Toaster } from 'react-hot-toast';

const GlobalToastContainer = () => {
    return (
        <Toaster
        toastOptions={{
          style: {
            fontSize: '14px',
          },
        }}
      />
    )
}

export default GlobalToastContainer;