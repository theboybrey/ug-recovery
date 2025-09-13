import * as Yup from "yup";

import { CloseCircle, Verify } from "iconsax-react";

import { IPaymentData } from "@/app/(website)/page";
import usePaymentVerification from "@/hooks/usePaymentConfimation";

const PaymentConfirmation: React.FC<IPaymentData> = ({
  reference,
  ...rest
}) => {
  const { data, isLoading, error, status, refetch } =
    usePaymentVerification(reference);

  return (
    <div className="flex flex-grow justify-center items-center">
      <div className="w-full md:w-96 px-4 py-8 md:px-10 bg-gray-light shadow-lg rounded-md md:mx-20 mx-auto md:absolute md:bottom-6 md:left-0 fixed inset-x-0 bottom-0 flex flex-col justify-center items-center md:items-start">
        {/* Close Button (Visible only on desktop) */}
        <p
          onClick={() => (window.location.href = "/dashboard")}
          className="cursor-pointer absolute top-2 right-2 text-white bg-primary w-8 h-8 rounded-full flex items-center justify-center hover:text-gray"
        >
          &#10005;
        </p>
        <h2 className="text-2xl font-bold text-center text-primary mb-4">
          Ticket Payment Status
        </h2>
        {isLoading && <p className="text-center text-primary">Loading...</p>}
        {!isLoading && error && (
          <p className="text-center text-primary">{error.message}</p>
        )}
        {!isLoading && data && (
          <div className="flex flex-col items-center justify-center w-full py-8 gap-y-4">
            {data.success ? (
              <Verify className="text-center text-green-600 animate-bounce" />
            ) : (
              <CloseCircle className="text-center text-red-600 animate-bounce" />
            )}
            <p className="text-center text-primary">{data.message}</p>
            {data.success && (
              <p className="text-center text-primary italic text-sm">
                {" "}
                You will recieve your ticket shortly via SMS and E-mail (if
                provided)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;
