import React, { FC } from 'react';

type Props = {
    type: 'primary' | 'secondary';
    style: 'outline' | 'filled';
    title: string;
    onClick?: () => void;
};

const Button: FC<Props> = ({ type, style, title, onClick }) => {
    let buttonClass = '@apply flex h-[60px] justify-center items-center w-fit gap-2.5 border px-6 py-5 rounded-[10px] border-solid text-center text-xl not-italic font-medium leading-[21px]';

    if (type === 'primary' && style === 'filled') {
        buttonClass += ' border-[#0061FF] bg-blue-500 hover:bg-blue-600';
    } else if (type === 'primary' && style === 'outline') {
        buttonClass += ' border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white';
    } else if (type === 'secondary' && style === 'filled') {
        buttonClass += ' border-[#131313] bg-white text-[#131313] hover:bg-gray-600 hover:text-[white]';
    } else if (type === 'secondary' && style === 'outline') {
        buttonClass += ' border border-gray-500 font-medium hover:bg-gray-500 hover:text-white';
    }

    return (
        <button className={buttonClass} onClick={onClick}>
            {title}
        </button>
    );
};

export default Button;
