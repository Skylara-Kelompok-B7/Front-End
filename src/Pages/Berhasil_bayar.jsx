import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../assets/components/Navbar";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Berhasil_bayar() {
  const [dataIdTiket, setDataIdTiket] = useState(null);

  const checkoutId = useSelector(
    (state) => state.booking.dataCheckoutBerangkat.id
  );

  console.log("CEKOUT ID", checkoutId);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrint = async () => {
      try {
        const response = await axios.get(`/api/checkout/${checkoutId}`, {
          withCredentials: true,
        });
        console.log("fetchUserData response:", response.data.data);
        setDataIdTiket(response?.data?.data?.id);
        // setQr(response.data.data);
      } catch (error) {
        console.error("Error fetching print data:", error);
      }
    };

    if (checkoutId) {
      fetchPrint();
    } else {
      null;
    }
  }, [checkoutId]);

  const id = location?.state?.id || undefined;

  const dataIdHistory = useSelector(
    (state) => state?.booking?.dataHasilCheckout
  );
  //   console.log("HISOTRY ID", dataCKHISTORY);

  return (
    <div>
      <Navbar />

      {/* Header Atas */}
      <div className="bg-white shadow-md  w-full max-sm:px-0 px-36 max-sm:w-full"
      >
        <div className="mx-4 sm:mx-20  pt-5 ">
          <div className="flex">
            <button className="flex items-center ml-4 text-lg font-bold text-slate-500   ">
              Isi Data diri
              <ChevronRightIcon className="h-6 w-6 text-[#176B87] mr-1" />
            </button>
            <button className="flex items-center ml-4 text-lg font-semibold text-slate-500  "  onClick={() => navigate("/Payment")}>
              Bayar
              <ChevronRightIcon className="h-6 w-6 text-text-slate-500 mr-1" />
            </button>
            <button className="flex items-center ml-4 text-lg font-semibold text-[#176B87] ">
              Selesai
              <ChevronRightIcon className="h-6 w-6 text-text-slate-500 mr-1" />{" "}
            </button>
          </div>
        </div>
        <div className="  max-sm:mr-0 max-sm:pl-2 mr-20 pl-52 py-5 text-center">
          <p className="flex  text-center pl-5 py-3 gap-5 w-[800px] h-[50] text-white font-semibold bg-[#64CCC5] rounded-xl max-sm:w-full">
            Selamat Transaksi Berhasil !
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-center py-10 ">
        <img src="/images/berhasil_bayar.png" alt="" className="w-60 h-auto" />
        <p className="text-lg font-semibold">Berhasil</p>
        <p className="text-sm text-[#176B87] font-semibold">
          Transaksi Berhasil !!
        </p>
        <div className="py-5 ">
          <button
            className="bg-[#176B87] py-2 px-5 border rounded-lg text-white font-semibold "
            onClick={() =>
              navigate("/DetailTiket", { state: { id: dataIdHistory } })
            }
          >
            Cetak Tiket
          </button>
        </div>

        <button
          className="bg-[#176B87] py-2 px-5 border rounded-lg  text-white font-semibold"
          onClick={() => navigate("/")}
        >
          Cari Penerbangan Lain
        </button>
      </div>
    </div>
  );
}
