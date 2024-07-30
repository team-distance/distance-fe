import toast from 'react-hot-toast';

/**
 * @param {function} toast - 토스트 JSX를 반환하는 함수
 * @param {boolean} [options.closeOnClickBackdrop] - Backdrop을 클릭했을 때 토스트가 꺼지는 여부 (기본값: false)
 * @returns {function} showToast 함수를 반환
 */

const useToastError = (toastContent, id, position) => {

    const showToast = () => {
        toast.error(
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

    return {showToast, dismissToast};
};

export default useToastError;
