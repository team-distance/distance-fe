import toast from 'react-hot-toast';

/**
 * @param {function} toastContent - 토스트 JSX를 반환하는 함수
 * @param {string} id - 토스트 아이디
 * @param {string} position - 토스트 위치(default는 bottom-center)
 * @param {string} type - 토스트 유형(default는 error)
 * @returns {object} showToast, dismissToast 함수를 포함하는 객체
 */

const useToast = (toastContent, id, position = 'bottom-center', type = 'error') => {

    const showToast = () => {
        toast[type](
            toastContent(),
            {
                id: id,
                position: position
            }
        )
    };

    const dismissToast = () => {
        toast.dismiss(id);
    }

    return { showToast, dismissToast };
};

export default useToast;
