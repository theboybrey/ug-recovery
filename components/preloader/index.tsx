import React from 'react';
import { classNames } from '@/utils';

const BouncingSquaresLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-secondary-100 z-50">
            <div className="flex space-x-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className={classNames(
                            "w-6 h-6 bg-primary rounded animate-bounce",
                            index === 0 ? "animation-delay-0" :
                                index === 1 ? "animation-delay-1" :
                                    index === 2 ? "animation-delay-2" :
                                        index === 3 ? "animation-delay-3" :
                                            "animation-delay-4"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default BouncingSquaresLoader;
