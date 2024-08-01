import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

/**
 * @param {function} toastContent - 토스트 JSX를 반환하는 함수
 * @param {string} id - 토스트 아이디
 * @param {string} position - 토스트 위치(default는 bottom-center)
 * @param {string} type - 토스트 유형(default는 error)
 * @returns {object} showToast, dismissToast 함수를 포함하는 객체
 */
export const useToast = (
    toastContent, id, position = 'bottom-center',
    type = 'error') => {

    const { pathname } = useLocation();

    useEffect(() => {
        toast.remove();
    }, [pathname])

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


/**
 * @param {Promise} response - 프로미스 객체
 * @param {function} successFunc - 성공 시 실행할 로직 함수
 * @param {function} errorFunc - 에러 시 실행할 로직 함수
 * @returns {object} showPromiseToast 함수를 반환
 */

export const usePromiseToast = () => {

    const { pathname } = useLocation();

    useEffect(() => {
        toast.remove();
    }, [pathname])

    const showPromiseToast = (response, successFunc, errorFunc) => {
        toast.promise(response, {
            loading: '전송 중...',
            success: successFunc,
            error: errorFunc
        }, {
            position: 'bottom-center'
        })
    }

    return { showPromiseToast }
}

