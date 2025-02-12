import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDestinasiPesawat,
  setLokasiKeberangkatan,
} from "../../../redux/Reducers/TiketReducer";

export default function ModalLokasi({
  visible,
  onClose,
  setKotaAwal,
  setDestinasi,
  id,
}) {
  const [selectedKota, setSelectedkota] = useState("");
  const [selectedDestinasi, setSelectedDestinasi] = useState("");
  const [namaKota, setNamaKota] = useState("");
  const dispatch = useDispatch();
  const Data = useSelector((state) => {
    return state?.tiket2.lokasi;
  });
  
  const Destinasi = useSelector((state) => {
    return state?.tiket?.lokasiTujuan
  });
  const Kota = useSelector((state) => {
    return state?.tiket?.LokasiKeberangkatan
  });

  useEffect(() => {
    setNamaKota("");
  }, [id]);

  const filteredData = Data?.filter((lokasi) =>
    lokasi.lokasi.toLowerCase().includes(namaKota.toLowerCase())
  );

  if (!visible) return null;
  return (
    <div className="absolute max-lg:fixed max-lg:top-0 z-50 max-lg:bg-black max-lg:bg-opacity-30 max-lg:h-screen max-lg:flex max-lg:justify-center max-lg:items-start  inset-0 top-[155px]">
      <div className="flex justify-center items-center z-50  max-xl:w-screen max-xl:mx-3">
        <div className="bg-white relative py-3 px-6 border-4 rounded-2xl max-lg:rounded-b-none border-[#176B87] w-[700px] max-lg:w-full  max-lg:border-none max-lg:absolute max-lg:bottom-0 max-lg:h-[60vh]">
          <div className="flex justify-between">
            <p className=" text-lg font-bold text-[#176B87] ">
              {id === 1 ? (
                <span>Kota Keberangkatan</span>
              ) : (
                <span>Kota Destinasi</span>
              )}
            </p>
            <button
              onClick={() => {
                onClose();
              }}
            >
              <img
                src="/images/X.png"
                alt=""
                className="h-4 w-4 my-[14px] mx-4 hover:cursor-pointer"
              />
            </button>
          </div>
          <div>
            <input
              type="text"
              className="w-full mb-3 border rounded-md py-2 px-2 outline-none"
              placeholder="Nama Kota ...."
              value={namaKota.trimStart()}
              pattern="[a-zA-Z ]*"
              onChange={(e) => {
                setNamaKota(e.target.value);
              }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, "");
              }}
            />
          </div>
          <div className="h-[45vh] max-lg:h-[40vh] overflow-y-auto flex flex-col gap-3">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((lokasi, index) => (
                <div
                  key={index}
                  className="hover:cursor-pointer"
                  onClick={() => {
                    if (id === 1) {
                      dispatch(setLokasiKeberangkatan(lokasi.kode_bandara));
                      setKotaAwal(lokasi.lokasi.split(",")[0]);
                      setSelectedkota(lokasi.lokasi);
                      onClose();
                    } else {
                      setDestinasi(lokasi.lokasi.split(",")[0]);
                      dispatch(setDestinasiPesawat(lokasi.kode_bandara));
                      setSelectedDestinasi(lokasi.lokasi);
                      onClose();
                    }
                  }}
                >
                  {lokasi?.kode_bandara ===
                  (id === 1 ? Kota : Destinasi) ? (
                    <div className="border-b-2 border-[#176B87]">
                      {lokasi.lokasi.split(",")[0]} <br />
                      <span className="text-gray-500 text-sm">
                        {lokasi.kode_bandara} - {lokasi.nama_bandara}
                      </span>
                    </div>
                  ) : (
                    <div className="border-b-2">
                      {lokasi.lokasi.split(",")[0]}
                      <br />
                      <span className="text-gray-500 text-sm">
                        {lokasi.kode_bandara} - {lokasi.nama_bandara}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-red-500 mt-4">
                Kota tidak ada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
