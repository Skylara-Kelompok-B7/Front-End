import React, { useState, useEffect } from "react";
import Navbar from "../assets/components/Navbar";
import Select from "react-select";
import {
  ChevronRightIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getPayment } from "../redux/Action/TiketAction";
import { setDokumenBooking } from "../redux/Reducers/DataBooking";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackToTop from "../assets/components/Modal/TombolBalikAtas";

const travelDokumen = () => {
  const [penumpangData, setPenumpangData] = useState([]);
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // formatRupiah
  const formatRupiah = (price) => {
    return price
      .toLocaleString("id-ID", { style: "currency", currency: "IDR" })
      .replace(/\,00$/, "");
  };

  //PENGAMAN BELUM LOGIN
  const Condition = useSelector((state) => {
    return state?.tiket2?.isLoggin;
  });
  console.log("condisi", Condition);
  useEffect(() => {
    if (Condition !== true) {
      setShowModal(true);
    }
  }, [Condition]);

  const handleLogin = () => {
    setShowModal(false);
    navigate("/login");
  };

  //Pengaman jika data belum terisi
  const DataBaru = useSelector((state) => state?.tiket);
  const {
    KelasPenerbangan,
    LokasiKeberangkatan,
    TanggalKeberangkatan,
    TanggalKepulangan,
    lokasiTujuan,
    totalSemuaPenumpang,
    idTiket,
  } = DataBaru || {};

  // console.log("TYPE PENERBANGAN", typePenerbanngan);
  useEffect(() => {
    if (idTiket === 1) {
      if (
        lokasiTujuan === "" ||
        LokasiKeberangkatan === "" ||
        TanggalKeberangkatan === "" ||
        totalSemuaPenumpang <= 0 ||
        KelasPenerbangan === ""
      ) {
        alert("Harap Lengkapi Semua Data Tiket");
        navigate("/");
        return;
      }
    } else {
      if (
        lokasiTujuan === "" ||
        LokasiKeberangkatan === "" ||
        TanggalKeberangkatan === "" ||
        TanggalKepulangan === "" ||
        totalSemuaPenumpang <= 0 ||
        KelasPenerbangan === ""
      ) {
        alert("Harap Lengkapi Semua Data Tiket");
        navigate("/");
        return;
      }
    }
  }, []);

  //MENAMPILKAN DATA TIKET PERGI
  const DataBooking = useSelector(
    (state) => state?.booking?.bookingTiketPesawatPergi
  );
  // console.log("DATA PERGI", DataBooking);

  //MENAMPILKAN DATA TIKET PULANG
  const DataBookingPulang = useSelector(
    (state) => state.booking.bookingTiketPesawatPulang
  );
  // console.log("DATA PULANG", DataBookingPulang);

  //MENAMPILKAN  DATA PENUMPANG KESELURAHN
  const DataPenumpang = useSelector((state) => state.tiket);
  //  console.log("Data penumpangoONE", DataPenumpang);

  // const DataBaru = useSelector((state) => state?.tiket);
  const typePenerbanngan = useSelector(
    (state) => state?.tiket?.typePenerbanngan
  );
  // console.log("TYPE PENERBANGAN", typePenerbanngan);

  // fungsi Perhitungan Harga
  const totalHargaPenumpang =
    (DataPenumpang.totalSemuaPenumpang - DataPenumpang.TotalPenumpang.Bayi) *
    DataBooking.price;
  let pajak = totalHargaPenumpang * 0.1;
  let totalHargaDenganPajak = totalHargaPenumpang + pajak;

  let totalHargaSemua = totalHargaDenganPajak;

  if (typePenerbanngan === "Pergi - Pulang") {
    const totalHargaPulang =
      (DataPenumpang.totalSemuaPenumpang - DataPenumpang.TotalPenumpang.Bayi) *
        DataBookingPulang.price +
      (DataPenumpang.totalSemuaPenumpang - DataPenumpang.TotalPenumpang.Bayi) *
        DataBooking.price;
    const pajakPulang = totalHargaPulang * 0.1;
    const totalHargaDenganPajakPulang = totalHargaPulang + pajakPulang;

    pajak = +pajakPulang;
    totalHargaDenganPajak = +totalHargaDenganPajakPulang;
    totalHargaSemua = +totalHargaDenganPajakPulang;
    // console.log("HARGA PErgi", totalHargaPenumpang);
    // console.log("HARGA PULANG", totalHargaPulang);
  }

  //Fungsi  FETHING API Option Negara
  useEffect(() => {
    // Fetch data dari API dan update options
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const data = response.data;
        const countryOptions = data
          .map((country) => ({
            value: country.name.common,
            label: country.name.common,
          }))
          .filter((country) => country.label !== "Israel"); // Filter Israel

        // Urutkan countryOptions berdasarkan label (nama negara)
        countryOptions.sort((a, b) => a.label.localeCompare(b.label));

        setOptions(countryOptions); // Update state options
      })
      .catch((error) => console.error("Error fetching country data:", error));
  }, []); // Kosong array dependencies berarti useEffect hanya berjalan sekali saat komponen mount

  // Setting ageGroup by jumlah penumpang
  useEffect(() => {
    const initialPenumpangData = [];
    for (let i = 0; i < DataPenumpang.TotalPenumpang.Dewasa; i++) {
      initialPenumpangData.push({
        ageGroup: "ADULT",
        id: `dewasa-${i}`,
        name: "Dewasa",
      });
    }
    for (let i = 0; i < DataPenumpang.TotalPenumpang.Anak; i++) {
      initialPenumpangData.push({
        ageGroup: "CHILD",
        id: `anak-${i}`,
        name: "Anak",
      });
    }
    for (let i = 0; i < DataPenumpang.TotalPenumpang.Bayi; i++) {
      initialPenumpangData.push({
        ageGroup: "BABY",
        id: `bayi-${i}`,
        name: "Bayi",
      });
    }
    setPenumpangData(initialPenumpangData);
  }, [DataPenumpang?.TotalPenumpang]);

  // Group passengers by type and count
  const groupPenumpangData = penumpangData.reduce((acc, penumpang) => {
    if (!acc[penumpang.name]) {
      acc[penumpang.name] = { count: 0, ageGroup: penumpang.ageGroup };
    }
    acc[penumpang.name].count += 1;
    return acc;
  }, {});

  // function ubah waktu
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = String(date?.getUTCHours()).padStart(2, "0");
    const minutes = String(date?.getUTCMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  //function format tanggal
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const month = monthNames[date.getUTCMonth()]; // getUTCMonth() is zero-based
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
  };

  // FOM DATA LOOPING
  useEffect(() => {
    const initialPenumpangData = [];
    for (let i = 0; i < DataPenumpang.TotalPenumpang.Dewasa; i++) {
      initialPenumpangData.push({
        ageGroup: "ADULT",
        id: `dewasa-${i}`,
        name: "Dewasa",
        titel: "",
        nama: "",
        tanggal_lahir: "",
        kewarganegaraan: "",
        ktp_pasport: "",
        negara_penerbit: "",
        berlaku_sampai: "",
        is_baby: false,
      });
    }
    for (let i = 0; i < DataPenumpang.TotalPenumpang.Anak; i++) {
      initialPenumpangData.push({
        ageGroup: "CHILD",
        id: `anak-${i}`,
        name: "Anak",
        titel: "",
        nama: "",
        tanggal_lahir: "",
        kewarganegaraan: "",
        ktp_pasport: "",
        negara_penerbit: "",
        berlaku_sampai: "",
        is_baby: false,
      });
    }
    for (let i = 0; i < DataPenumpang.TotalPenumpang.Bayi; i++) {
      initialPenumpangData.push({
        ageGroup: "BABY",
        id: `bayi-${i}`,
        name: "Bayi",
        titel: "",
        nama: "",
        tanggal_lahir: "",
        kewarganegaraan: "",
        ktp_pasport: "",
        negara_penerbit: "",
        berlaku_sampai: "",
        is_baby: true,
      });
    }
    setPenumpangData(initialPenumpangData);
  }, [DataPenumpang?.TotalPenumpang]);

  // Fungsi validasi untuk nama (harus huruf)
  const validateName = (name) => {
    return name === "" || /^[a-zA-Z\s]+$/.test(name);
  };

  // Fungsi validasi untuk NIK (harus angka dan 16 digit)
  const validateNIK = (nik) => {
    // Hanya mengizinkan angka di input, tanpa menghalangi pengguna untuk menghapus angka pertama
    return nik === "" || /^[0-9]*$/.test(nik);
  };

  // Fungsi validasi untuk umur minimal 12 tahun
  const validasiTanggalLahir = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const twoDaysAgo = new Date(today.setDate(today.getDate() - 2));

    if (birthDate > twoDaysAgo) {
      return false; // Tanggal lahir tidak valid jika lebih dari 2 hari yang lalu
    }
    return true; // Tanggal lahir valid jika 2 hari atau lebih dari hari ini
  };

  const validasasiMasaBerlaku = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const hariIni = new Date(today.setDate(today.getDate()));

    if (hariIni > birthDate) {
      return false; // Tanggal berlaku tidak valid jika kurang dari hari ini
    }
    return true; // Tanggal berlaku valid jika tidak kurang dari hari ini
  };

  const handleChange = (id, field, value) => {
    if (field === "nama" && !validateName(value)) {
      alert("Nama harus berupa huruf.");
      return;
    }
    if (field === "ktp_pasport" && !validateNIK(value)) {
      alert("NIK/Paspot harus berupa angka.");
      return;
    }
    if (field === "tanggal_lahir" && !validasiTanggalLahir(value)) {
      alert("Tanggal lahir harus setidaknya 2 hari sebelum hari ini.");
      return;
    }
    if (field === "berlaku_sampai" && !validasasiMasaBerlaku(value)) {
      alert("Tanggal tidak boleh kurang hari ini.");
      return;
    }
    handleInputChange(id, field, value); // handleInputChange adalah fungsi yang mengubah state atau data penumpang
  };

  const handleInputChange = (id, field, value) => {
    setPenumpangData((prevData) =>
      prevData.map((penumpang) =>
        penumpang.id === id ? { ...penumpang, [field]: value } : penumpang
      )
    );
  };

  // AMBIL ID PERGI
  const dataInputPesanan = useSelector(
    (state) => state.booking.bookingTiketPesawatPergi
  );

  // AMBIL ID PULANG
  const dataInputanPesananPulang = useSelector(
    (state) => state.booking.bookingTiketPesawatPulang
  );
  // console.log("DATA PULANG DARI ORDER", dataInputanPesananPulang);

  const handleSimpanDataPenumpang = () => {
    const isValid = penumpangData.every(
      (penumpang) =>
        penumpang.titel &&
        penumpang.nama &&
        penumpang.tanggal_lahir &&
        penumpang.kewarganegaraan &&
        penumpang.ktp_pasport &&
        penumpang.negara_penerbit &&
        penumpang.berlaku_sampai
    );

    if (isValid) {
      const dataToSave = penumpangData.map((penumpang, tipePenumpang) => ({
        titel: penumpang.titel,
        nama: penumpang.nama,
        tanggal_lahir: penumpang.tanggal_lahir,
        kewarganegaraan: penumpang.kewarganegaraan,
        ktp_pasport: penumpang.ktp_pasport,
        negara_penerbit: penumpang.negara_penerbit,
        // Format tanggal berlaku
        berlaku_sampai: new Date(penumpang.berlaku_sampai).toISOString(),
        is_baby: penumpang.is_baby,
      }));

      // Simpan dataToSave ke dalam state atau lakukan dispatch ke action lain sesuai kebutuhan
      // console.log("Data to save:", dataToSave);

      const paramsData = {
        penumpang: dataToSave,
        tipePenumpang: typePenerbanngan,
      };
      dispatch(
        getPayment(
          [dataInputPesanan.id, dataInputanPesananPulang.id],
          paramsData,
          navigate
        )
      ); // Pastikan dataInputPesanan.id tersedia
      dispatch(setDokumenBooking(paramsData));
    } else {
      toast.warning("Semua form wajib diisi!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    // console.log("data Inputan Pergi", dataInputPesanan.id);
    // console.log("data Inputan Pulang", dataInputanPesananPulang.id);
  };

  const dataPemesan = useSelector((state) => state?.login);
  //  console.log("Data Pemesan user", dataPemesan);

  return (
    <>
      <div className="bg-white">
        <div className="fixed  w-full bg-white z-50 shadow">
          <Navbar />
        </div>
        {/* Header Atas */}
        <div className="bg-white shadow-md w-full max-sm:w-full md:px-4 ma ">
          <div className="mx-4 lg:mx-20 pt-5 ">
            <div className="flex mt-28 lg:mx-36">
              <button className="flex items-center lg:ml-4 text-lg font-bold text-[#176B87] ">
                Isi Data diri
                <ChevronRightIcon className="h-6 w-6 text-[#176B87] mr-1" />
              </button>
              <button className="flex items-center ml-4 text-lg font-semibold text-slate-500 ">
                Bayar
                <ChevronRightIcon className="h-6 w-6 text-text-slate-500 mr-1" />
              </button>
              <button className="flex items-center ml-4 text-lg font-semibold text-slate-500 ">
                Selesai
                <ChevronRightIcon className="h-6 w-6 text-text-slate-500 mr-1" />{" "}
              </button>
            </div>
          </div>
          <div className=" mx-4 sm:mx-auto sm:max-w-none sm:mr-0 sm:pl-2  flex justify-center py-5 text-center">
            <button
              className=" max-sm:w-full flex items-center pl-5 gap-5 w-[800px] h-[50] text-white font-semibold bg-gradient-to-r from-[#176B87] to-[#64CCC5] rounded-xl"
              onClick={() => navigate("/resultSearch")}
            >
              <ArrowLongLeftIcon className="h-12 w-12 text-slate-200 mr-1 pl-1 flex items-center" />
              Kembali
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg p-6 z-10">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Belum Login❗
              </h2>
              <p className="mb-4">
                Kamu harus login untuk melanjutkan pemesanan !
              </p>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg "
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="container mx-auto">
          <div className="max-sm:w-full max-lg:flex-col flex justify-center gap-10 mx-10 px-20 max-sm:px-0 max-sm:mx-0">
            <div>
              {/* Data Pemesanan */}
              <div className="max-sm:w-full mt-10 border rounded-xl border-slate-300 p-10 lg:w-[600px] w-full text-xl">
                <p className="text-[#176B87] font-semibold pb-5">
                  Isi Data Pemesanan
                </p>
                <div>
                  <p className="bg-[#176B87] text-white rounded-t-md py-2 px-4 max-sm:w-full">
                    Data Diri Pemesanan
                  </p>
                  {<form action="" className="py-3 "></form>}
                  <p className="text-[#176B87] font-semibold">Nama Lengkap</p>
                  <p className="border border-slate-300 lg:w-[520px] w-full p-2 my-2 max-sm:w-full">
                    {dataPemesan?.nama}
                  </p>
                  <p className="text-[#176B87] font-semibold">Nomor Telepon</p>
                  <p className="border border-slate-300 lg:w-[520px] w-full p-2 my-2 max-sm:w-full">
                    {dataPemesan?.no_telp}
                  </p>
                  <p className="text-[#176B87] font-semibold">Alamat</p>
                  <p className="border border-slate-300 lg:w-[520px] w-full p-2 my-2 max-sm:w-full">
                    {dataPemesan?.alamat}
                  </p>
                </div>
              </div>

              {/* Isi Data Penumpang */}
              <div className="mt-10 border rounded-xl border-slate-300 p-10 lg:w-[600px] w-full text-xl max-sm:w-full max-sm:p-5 ">
                <p className="text-[#176B87] font-semibold pb-5 ">
                  Isi Data Penumpang
                </p>
                {penumpangData.map((penumpang, index) => (
                  <div
                    key={penumpang?.id}
                    className="mt-5 border rounded-xl border-slate-300 p-10 lg:w-[520px] w-full text-xl max-sm:w-full max-sm:p-5"
                  >
                    <div>
                      <p className="bg-[#176B87] text-white rounded-t-md py-2 px-4">
                        Data Diri Penumpang {index + 1} - {penumpang?.name}
                      </p>
                      <form action="" className="py-3"></form>
                      <label className="text-[#176B87] font-semibold">
                        titel
                      </label>
                      <select
                        value={penumpang?.titel}
                        onChange={(e) =>
                          handleChange(penumpang?.id, "titel", e?.target?.value)
                        }
                        className="border border-slate-300 lg:lg:w-[440px] w-full p-2 my-2 max-sm:w-full    "
                      >
                        <option value=""></option>
                        <option value="Tuan">Tuan</option>
                        <option value="Nyonya">Nyonya</option>
                        <option value="Nona">Nona</option>
                      </select>
                      <label className="text-[#176B87] font-semibold">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={penumpang?.nama}
                        required
                        onChange={(e) =>
                          handleChange(penumpang?.id, "nama", e.target.value)
                        }
                        className="border border-slate-300 lg:w-[440px] w-full p-2 my-2 max-sm:w-full"
                      />
                      <label className="text-[#176B87] font-semibold">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        value={penumpang?.tanggal_lahir}
                        required
                        onChange={(e) =>
                          handleChange(
                            penumpang?.id,
                            "tanggal_lahir",
                            e.target.value
                          )
                        }
                        className="border border-slate-300 lg:w-[440px] w-full p-2 my-2 max-sm:w-full"
                      />
                      <label className="text-[#176B87] font-semibold">
                        Kewarganegaraan
                      </label>
                      <Select
                        required
                        value={options.find(
                          (option) =>
                            option.value === penumpang?.kewarganegaraan
                        )}
                        onChange={(selectedOption) =>
                          handleChange(
                            penumpang?.id,
                            "kewarganegaraan",
                            selectedOption?.value
                          )
                        }
                        options={options}
                        className="border border-slate-300 lg:w-[440px] w-full p-2 my-2 max-sm:w-full"
                      />
                      <label className="text-[#176B87] font-semibold">
                        No KTP/Paspor
                      </label>
                      <input
                        type="text"
                        value={penumpang?.ktp_pasport}
                        required
                        onChange={(e) =>
                          handleChange(
                            penumpang?.id,
                            "ktp_pasport",
                            e?.target?.value
                          )
                        }
                        className="border border-slate-300 lg:w-[440px] w-full p-2 my-2 max-sm:w-full"
                      />
                      <label className="text-[#176B87] font-semibold">
                        Negara Penerbit
                      </label>
                      <Select
                        required
                        value={options.find(
                          (option) =>
                            option?.value === penumpang?.negara_penerbit
                        )}
                        onChange={(selectedOption) =>
                          handleChange(
                            penumpang.id,
                            "negara_penerbit",
                            selectedOption?.value
                          )
                        }
                        options={options}
                        className="border border-slate-300 lg:w-[440px] w-full p-2 my-2 max-sm:w-full"
                      />
                      <label className="text-[#176B87] font-semibold">
                        Berlaku Sampai
                      </label>
                      <input
                        type="date"
                        value={penumpang?.berlaku_sampai}
                        required
                        onChange={(e) =>
                          handleChange(
                            penumpang?.id,
                            "berlaku_sampai",
                            e?.target?.value
                          )
                        }
                        className="border border-slate-300 lg:w-[440px] w-full p-2 my-2 max-sm:w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="flex justify-center">
                <button
                  className="bg-[#176B87] text-white text-xl text-center py-2 px-10 rounded-xl mt-5 w-[300px] mb-10"
                 
                >
                  Simpan
                </button>
              </div> */}
            </div>

            {/* Detail Penerbangan */}
            <div className="lg:w-[400px] mt-10 w-full">
              <div className="p-5 border-2 border-slate-200 rounded-xl">
                <div>
                  <div className="mt-5">
                    <div className="px-5">
                      {/* TIKET PERGI */}
                      <div>
                        <p className="font-bold text-[#176B87] pt-5 pb-3 text-xl">
                          Detail Penerbangan
                        </p>
                        <div>
                          <div className="flex justify-between">
                            <p className="font-bold text-xl">
                              {formatTime(DataBooking?.schedule?.takeoff?.time)}
                            </p>
                            <p className="font-semibold text-[#64CCC5]">
                              Keberangkatan
                            </p>
                          </div>

                          <p>
                            {formatDate(DataBooking?.schedule?.takeoff?.time)}
                          </p>
                          <p>{DataBooking?.schedule?.takeoff?.airport_name}</p>
                          <p>
                            Terminal {DataBooking?.schedule?.takeoff?.terminal}
                          </p>
                        </div>
                        <div className="my-3 py-2 border-t-2 border-b-2 flex gap-3">
                          <div className="flex items-center">
                            <img
                              src={DataBooking?.plane?.logo}
                              alt={DataBooking?.plane?.airline_name}
                              className="h-6 w-6"
                            />
                          </div>
                          <div>
                            <div className="font-bold pb-3">
                              <p>{DataBooking?.plane?.airline_name}</p>
                              <p>{DataBooking?.plane?.model}</p>
                            </div>
                            <p className="font-bold">Informasi :</p>
                            <p>{DataBooking?.class}</p>
                            <p>Bagasi {DataBooking?.plane?.baggage} Kg</p>
                            <p>
                              Bagasi Kabin {DataBooking?.plane?.cabin_baggage}{" "}
                              Kg
                            </p>
                            {/* <p>Fasilitas {DataBooking.Fasilitas}</p> */}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <p className="font-bold text-xl">
                              {formatTime(DataBooking?.schedule?.landing?.time)}
                            </p>
                            <p className="font-semibold text-[#64CCC5]">
                              Kedatangan
                            </p>
                          </div>

                          <p>
                            {formatDate(DataBooking?.schedule?.landing?.time)}
                          </p>
                          <p>{DataBooking?.schedule?.landing?.airport_name}</p>
                          <p>
                            Terminal {DataBooking?.schedule?.landing?.terminal}
                          </p>
                        </div>
                      </div>

                      {/* TIKET PULANG */}
                      {typePenerbanngan == "Pergi - Pulang" && (
                        <>
                          {DataBookingPulang?.schedule?.takeoff?.time && (
                            <div className="mt-5 border-t-4 border-[#FE5D02]">
                              <div className="">
                                <p className="font-bold text-[#176B87] pt-5 pb-3 text-xl">
                                  Detail Penerbangan Pulang
                                </p>
                                <div>
                                  <div className="flex justify-between">
                                    <p className="font-bold text-xl">
                                      {formatTime(
                                        DataBookingPulang?.schedule?.takeoff
                                          ?.time
                                      )}
                                    </p>
                                    <p className="font-semibold text-[#64CCC5]">
                                      Keberangkatan
                                    </p>
                                  </div>
                                  <p>
                                    {formatDate(
                                      DataBookingPulang?.schedule?.takeoff?.time
                                    )}
                                  </p>
                                  <p>
                                    {
                                      DataBookingPulang.schedule?.takeoff
                                        ?.airport_name
                                    }
                                  </p>
                                  <p>
                                    Terminal{" "}
                                    {
                                      DataBookingPulang?.schedule?.takeoff
                                        ?.terminal
                                    }
                                  </p>
                                </div>
                                <div className="my-3 py-2 border-t-2 border-b-2 flex gap-3">
                                  <div className="flex items-center">
                                    <img
                                      src={DataBookingPulang?.plane?.logo}
                                      alt={
                                        DataBookingPulang?.plane?.airline_name
                                      }
                                      className="h-6 w-6"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-bold pb-3">
                                      <p>
                                        {DataBookingPulang?.plane?.airline_name}
                                      </p>
                                      <p>{DataBookingPulang?.plane?.model}</p>
                                    </div>
                                    <p className="font-bold">Informasi :</p>
                                    <p>{DataBookingPulang?.class}</p>
                                    <p>
                                      Bagasi {DataBookingPulang?.plane?.baggage}{" "}
                                      Kg
                                    </p>
                                    <p>
                                      Bagasi Kabin{" "}
                                      {DataBookingPulang?.plane?.cabin_baggage}{" "}
                                      Kg
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between">
                                    <p className="font-bold text-xl">
                                      {formatTime(
                                        DataBookingPulang?.schedule?.landing
                                          ?.time
                                      )}
                                    </p>
                                    <p className="font-semibold text-[#64CCC5]">
                                      Kedatangan
                                    </p>
                                  </div>
                                  <p>
                                    {formatDate(
                                      DataBookingPulang?.schedule?.landing?.time
                                    )}
                                  </p>
                                  <p>
                                    {
                                      DataBookingPulang?.schedule?.landing
                                        ?.airport_name
                                    }
                                  </p>
                                  <p>
                                    Terminal{" "}
                                    {
                                      DataBookingPulang?.schedule?.landing
                                        ?.terminal
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Rincian Bayar */}
                      <div className="my-3 py-2 border-t-4 border-b-4 border-[#FE5D02]">
                        <p className="font-bold text-xl">Rincian Harga</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(groupPenumpangData).map(
                            ([name, { count, ageGroup }]) => (
                              <div
                                className="flex justify-between col-span-2"
                                key={name}
                              >
                                <div className="flex gap-2">
                                  <p>{count}</p>
                                  <p>{name}</p>
                                </div>
                                <p className="">
                                  {ageGroup === "BABY"
                                    ? "0"
                                    : typePenerbanngan === "Pergi - Pulang"
                                    ? formatRupiah(
                                        (DataBooking?.price +
                                          DataBookingPulang?.price) *
                                          count
                                      )
                                    : formatRupiah(DataBooking?.price * count)}
                                </p>
                              </div>
                            )
                          )}

                          <div className="flex justify-between col-span-2">
                            <p className="text-sm flex items-center">
                              Pajak + Donasi Palestina 10%
                            </p>
                            <p>{formatRupiah(pajak)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-bold text-xl">Total</p>
                        <p className="font-bold text-xl text-[#176B87]">
                          {formatRupiah(totalHargaDenganPajak)}
                        </p>
                      </div>
                      <div className="py-5 border-t-2">
                        <button
                          className="bg-[#176B87] w-full text-white text-xl font-semibold py-2 px-5 flex justify-center items-center rounded-xl "
                          onClick={handleSimpanDataPenumpang}
                        >
                          Lanjut Bayar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BackToTop />
      </div>
    </>
  );
};

export default travelDokumen;
