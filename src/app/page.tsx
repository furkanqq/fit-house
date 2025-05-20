"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import {
  AllUsersState,
  CustomState,
  NewUserModal,
  SureType,
  User,
} from "@/types";
import { cn } from "@/utils/cn";
import html2canvas from "html2canvas";
import {
  BellDotIcon,
  Check,
  CheckCheckIcon,
  Edit,
  LogOut,
  Save,
  Send,
  Share,
  SidebarClose,
  Trash,
  Trash2,
  UserPlus,
  UserRound,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [sure, setSure] = useState<SureType>({ open: false, userId: null });
  const [scannedData, setScannedData] = useState<string>("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [errorAudio, setErrorAudio] = useState<HTMLAudioElement | null>(null);
  const [deleteSure, setDeleteSure] = useState<SureType>({
    open: false,
    userId: null,
  });
  const [customUsers, setCustomUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [shareButton, setShareButton] = useState<boolean>(false);
  const [custom, setCustom] = useState<CustomState>({
    open: false,
    name: "",
    email: "",
    message1: "",
    message2: "",
    message3: "",
    message4: "",
    message5: "",
  });
  const [allUsers, setAllUsers] = useState<AllUsersState>({
    open: false,
    message1: "",
    message2: "",
    message3: "",
    message4: "",
    message5: "",
  });
  const [newUserModal, setNewUserModal] = useState<NewUserModal>({
    type: "new",
    id: null,
    open: false,
    name: "",
    email: "",
    remaininglessons: "",
    qrCode: "",
  });
  const [qrCode, setQrCode] = useState<{
    open: boolean;
    id: number | null;
    userName: string;
  }>({
    open: false,
    id: null,
    userName: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudio(new Audio("/welcome2.mp3")); // Tarayıcıda ses dosyasını yüklüyoruz
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setErrorAudio(new Audio("/error.mp3")); // Tarayıcıda ses dosyasını yüklüyoruz
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();

      setUsers(data);
      setCustomUsers(
        data.sort((a: User, b: User) => a.name.localeCompare(b.name))
      );
    };
    fetchUsers();
  }, []);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleDeleteUser = async (userId: number) => {
    await fetch("/api/users/update/user/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((result) => {
        if (result.ok) {
          const fetchUsers = async () => {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
            setCustomUsers(
              data.sort((a: User, b: User) => a.name.localeCompare(b.name))
            );
          };
          fetchUsers();
          setDeleteSure({ open: false, userId: null });
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleLessonDecrement = async (userId: number) => {
    const manuelCondition = users.find((user) => user.id === userId);

    if (!manuelCondition) {
      alert("Kullanıcı bulunamadı.");
      return;
    }

    if (manuelCondition && manuelCondition.remaininglessons <= 0) {
      alert("Kullanıcının kalan ders hakkı bulunmamaktadır.");
      return;
    }
    const config = {
      htmlFile: {
        htmlName: "/template/feedback",
        title: "Fit House Training Studio",
      },
      mailRequest: {
        name: manuelCondition.name,
        message1: `Harika bir iş çıkardınız, tebrikler! 🎉 Şu an ders paketinizde sadece 2 ders kaldı. Hedeflerinize çok yaklaştınız ve bu başarıyı devam ettirmeniz için buradayız.`,
        message2:
          "Yeni bir ders paketiyle formunuzu koruyup geliştirmeye devam etmeye ne dersiniz?",
        message3: " Hemen iletişime geçin ve kaldığınız yerden devam edelim.",
        message4: "💪 Sizinle çalışmaktan her zaman mutluluk duyuyoruz,",
        message5: " Fit House Training Studio Ekibi",
      },
    };

    await fetch("/api/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, config }),
    })
      .then((result) => {
        if (result.ok) {
          const fetchUsers = async () => {
            const res = await fetch("/api/users");
            const data = await res.json();

            setUsers(data);
            setCustomUsers(
              data.sort((a: User, b: User) => a.name.localeCompare(b.name))
            );
          };
          fetchUsers();
          setSure({ open: false, userId: null });
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleLessonDecrementByQR = async (userId: number) => {
    const manuelCondition = users.find((user) => user.id === userId);

    if (!manuelCondition) {
      // alert("Kullanıcı bulunamadı.");
      if (errorAudio) {
        errorAudio.play(); // Ses çal
      }
      return;
    }

    if (manuelCondition && manuelCondition.remaininglessons <= 0) {
      alert("Kullanıcının kalan ders hakkı bulunmamaktadır.");
      return;
    }
    const config = {
      htmlFile: {
        htmlName: "/template/feedback",
        title: "Fit House Training Studio",
      },
      mailRequest: {
        name: manuelCondition.name,
        message1: `Harika bir iş çıkardınız, tebrikler! 🎉 Şu an ders paketinizde sadece 2 ders kaldı. Hedeflerinize çok yaklaştınız ve bu başarıyı devam ettirmeniz için buradayız.`,
        message2:
          "Yeni bir ders paketiyle formunuzu koruyup geliştirmeye devam etmeye ne dersiniz?",
        message3: " Hemen iletişime geçin ve kaldığınız yerden devam edelim.",
        message4: "💪 Sizinle çalışmaktan her zaman mutluluk duyuyoruz,",
        message5: " Fit House Training Studio Ekibi",
      },
    };

    await fetch("/api/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, config }),
    })
      .then((result) => {
        if (result.ok) {
          if (audio) {
            audio.play(); // Ses çal
          }
          const fetchUsers = async () => {
            const res = await fetch("/api/users");
            const data = await res.json();

            setUsers(data);
            setCustomUsers(
              data.sort((a: User, b: User) => a.name.localeCompare(b.name))
            );
          };
          fetchUsers();
          setSure({ open: false, userId: null });
        }
      })
      .catch((err) => {
        // alert(err);
        console.log(err, "err");
        if (errorAudio) {
          errorAudio.play(); // Ses çal
        }
      });
  };

  useEffect(() => {
    if (inputValue === "") {
      setCustomUsers(
        users.sort((a: User, b: User) => a.name.localeCompare(b.name))
      );
    } else {
      const filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          user.email.toLowerCase().includes(inputValue.toLowerCase())
      );
      setCustomUsers(
        filteredUsers.sort((a: User, b: User) => a.name.localeCompare(b.name))
      );
    }
  }, [inputValue, users]);

  const handleSendAllMail = async () => {
    const { message1, message2, message3, message4, message5 } = allUsers;

    const messages = [message1, message2, message3, message4, message5];

    if (users.length === 0) {
      alert("Kullanıcı bulunamadı.");
      return;
    } else if (!messages.some((msg) => msg.trim() !== "")) {
      alert("En az bir mesaj alanı doldurulmalıdır.");
      return;
    }

    const config = {
      htmlFile: {
        htmlName: "/template/feedback",
        title: "Fit House Training Studio",
      },
      mailRequest: {
        message1,
        message2,
        message3,
        message4,
        message5,
      },
    };

    await fetch("/api/users/custom/all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    })
      .then((result) => {
        if (result.ok) {
          setAllUsers({
            open: false,
            message1: "",
            message2: "",
            message3: "",
            message4: "",
            message5: "",
          });

          alert("Tüm kullanıcılara mail gönderildi.");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleSendCustomMail = async () => {
    const { name, email, message1, message2, message3, message4, message5 } =
      custom;

    const messages = [message1, message2, message3, message4, message5];

    if (!name || !email) {
      alert("Ad Soyad ve Mail alanları doldurulmalıdır.");
      return;
    } else if (!messages.some((msg) => msg.trim() !== "")) {
      alert("En az bir mesaj alanı doldurulmalıdır.");
      return;
    }

    const config = {
      htmlFile: {
        htmlName: "/template/feedback",
        title: "Fit House Training Studio",
      },
      mailRequest: {
        name: name,
        message1,
        message2,
        message3,
        message4,
        message5,
      },
    };

    await fetch("/api/users/custom/mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, config }),
    })
      .then((result) => {
        if (result.ok) {
          setCustom({
            open: false,
            name: "",
            email: "",
            message1: "",
            message2: "",
            message3: "",
            message4: "",
            message5: "",
          });

          alert("Mail gönderildi.");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  const divRef = useRef<HTMLDivElement>(null);

  const handleShareQrCode = async () => {
    setShareButton(true);

    setTimeout(async () => {
      if (!divRef.current) return;

      // 📸 1. Div'i görsele çevir
      const canvas = await html2canvas(divRef.current, { useCORS: true });
      const image = canvas.toDataURL("image/png");

      // 📥 2. Görseli indirilebilir bir dosya yap
      const blob = await fetch(image).then((res) => res.blob());
      const file = new File([blob], "shared-image.png", { type: "image/png" });

      // Kullanıcıya görseli indirmesi için bir link verebilirsin
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(file);
      downloadLink.download = `${qrCode.userName}_qrCode.png`;
      downloadLink.click();
    }, 1500);

    setTimeout(() => {
      setShareButton(false);
    }, 2000);
  };

  let intervalId: NodeJS.Timeout | null = null;

  const startKeepAlive = () => {
    if (intervalId) return;

    intervalId = setInterval(() => {
      let total = 0;
      total += Math.sqrt(1234);
      console.log("sayfa aktif:", total);
      // CPU dostu işlem
    }, 20000);
  };

  useEffect(() => {
    startKeepAlive();
  }, []);

  const handleNewUserSubmit = async () => {
    const { name, email, remaininglessons } = newUserModal;

    if (!name || !email || !remaininglessons) {
      alert("Tüm alanları doldurunuz.");
      return;
    }

    if (newUserModal.type === "new") {
      const newUser: User = {
        id: users.length + 1,
        name,
        email,
        remaininglessons: Number(remaininglessons),
      };

      await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
        .then((result) => {
          if (result.ok) {
            const fetchUsers = async () => {
              const res = await fetch("/api/users");
              const data = await res.json();

              setUsers(data);
              setCustomUsers(
                data.sort((a: User, b: User) => a.name.localeCompare(b.name))
              );
            };
            fetchUsers();
            // setUsers((prev) => [...prev, newUser]);
            // setCustomUsers((prev) => [...prev, newUser]);
            setNewUserModal({
              type: "new",
              open: false,
              name: "",
              email: "",
              remaininglessons: "",
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      if (newUserModal.id == null) {
        alert("Kullanıcı ID'si belirtilmeli.");
        return;
      }
      const updatedUser = {
        id: newUserModal.id,
        name,
        email,
        remaininglessons: Number(remaininglessons),
      };

      await fetch("/api/users/update/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      })
        .then((result) => {
          if (result.ok) {
            const fetchUsers = async () => {
              const res = await fetch("/api/users");
              const data = await res.json();

              setUsers(data);
              setCustomUsers(
                data.sort((a: User, b: User) => a.name.localeCompare(b.name))
              );
            };
            fetchUsers();
            setNewUserModal({
              type: "update",
              id: null,
              open: false,
              name: "",
              email: "",
              remaininglessons: "",
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const usersPerPage = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);

  useEffect(() => {
    setCurrentPage(1);
    const paginated = customUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );
    setPaginatedUsers(paginated);
  }, [customUsers, users]);

  useEffect(() => {
    const paginated = customUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );
    setPaginatedUsers(paginated);
  }, [currentPage]);

  function handleLogout() {
    fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          setTimeout(() => {
            router.push("/login");
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const bufferRef = useRef("");

  useEffect(() => {
    setScannedData(""); // İlk açılışta temizle

    const handleKeyPress = (event: KeyboardEvent) => {
      console.log(bufferRef.current, "buffer");

      if (document.activeElement?.tagName === "INPUT") return;

      if (event.key === "Enter") {
        if (bufferRef.current.trim() !== "") {
          setScannedData(bufferRef.current);
          bufferRef.current = ""; // temizle
        }
      } else {
        // Sadece rakamları ekle
        if (/^[0-9]$/.test(event.key)) {
          bufferRef.current += event.key;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (scannedData !== "") {
      handleLessonDecrementByQR(+scannedData);
      setScannedData("");
    }
  }, [scannedData]);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasRead = localStorage.getItem("popupRead");
    if (!hasRead) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("popupRead", "true");
    setShowPopup(false);
  };

  // if (!showPopup) return null;

  return (
    <div className="relative flex min-h-[100vh] w-full !items-center flex-col gap-12 md:my-1 my-8 px-2">
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black z-[1000] text-white">
          <div className="absolute flex flex-col gap-4 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[94%] md:w-1/2 h-screen md:h-fit text-center overflow-scroll pt-8 pb-5 md:pb-0 md:pt-0">
            <div>
              <h1 className="text-2xl">
                Değerli Süleyman Yeşil ve Değerli Burak Angın,
              </h1>
              <p className="text-xs text-blue-400">
                Bu mesajı yalnızca bir kez göreceksiniz.
              </p>
            </div>
            <div className="text-left flex flex-col gap-3 text-white">
              <p>
                Öncelikle, sistemdeki hataları minimuma indirmek adına birkaç
                çalışma gerçekleştirdiğimi sizlerle paylaşmak isterim.
                Önümüzdeki birkaç gün boyunca sizlerle birlikte test sürecine
                devam edeceğiz. Bu nedenle geri bildirimlerinizi benim için çok
                kıymetli olacak.
              </p>
              <div>
                <label>
                  Sizden özellikle dikkat etmenizi rica ettiğim birkaç nokta
                  var:
                </label>
                <ul>
                  <li className="ml-4">
                    - Öğrenciler yalnızca bir kez QR okutmalı. Bu, öğrenciden
                    isteyeceğiniz tek şey olacak. Sonrası sizin
                    sorumluluğunuzda.
                  </li>
                  <li className="ml-4">
                    - Masadan ayrılacağınız zaman sayfayı yenileyip açık
                    bırakmanız gerekiyor. Eğer sayfayı yenilemek zor gelirse, en
                    azından:
                    <ul>
                      <li className="ml-8">
                        - Web sitesine odaklanmış (sayfanın herhangi bir alanına
                        tıklanmış) olduğundan,
                      </li>
                      <li className="ml-8">
                        - Herhangi bir input alanına (arama kutusu vb.)
                        odaklanılmadığından emin olun.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <p>
                Süleyman, "Bunlarla mı uğraşacağız?" dediğini duyar gibiyim 🙂
                Ama bunlar gerçekten çok basit ve hataları önlemek için gerekli
                ufak adımlar.
              </p>
              <p>
                Bilginize sunarım. Hepinize güzel ve verimli bir çalışma günü
                dilerim.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full justify-between mt-4">
              <Button
                onClick={() => setShowPopup(false)}
                variant="outline"
                className="w-full"
              >
                <BellDotIcon />
                Daha Sonra Tekrar Hatırlat.
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full"
              >
                <CheckCheckIcon className="mr-2" />
                Okudum, Anladım.
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-[url('/pattern.png')] bg-contain"></div>
      <div className="relative md:w-[320px] md:h-[180px] w-[220px] h-[120px]">
        <Image
          src="https://www.fithousetrainingstudio.com/images/logo/6214858539465-672-fithouse-footer-logo.png"
          alt="fithouse"
          fill
        />
      </div>
      <div className="relative z-20 max-w-[920px] w-full flex flex-col gap-6">
        <div className="flex gap-4 flex-col-reverse md:flex-row justify-between">
          <div className="w-full md:w-1/2">
            <Input
              type="text"
              placeholder="Ara..."
              className="w-full"
              onChange={handleInputValue}
            />
          </div>
          <div className="w-full md:w-1/2 flex justify-end gap-2">
            <Button
              variant="outlineGreen"
              onClick={() =>
                setNewUserModal({ ...newUserModal, open: true, type: "new" })
              }
            >
              <UserPlus />
              Ekle
            </Button>
            <Button
              variant="outlineGreen"
              onClick={() => setCustom({ ...custom, open: true })}
            >
              <UserRound />
              Özel Mail
            </Button>
            <Button
              variant="outlineGreen"
              onClick={() => setAllUsers({ ...allUsers, open: true })}
            >
              <UsersRound />
              Toplu Mail
            </Button>
          </div>
        </div>
        {paginatedUsers && paginatedUsers.length > 0 ? (
          <Table className="relative">
            <TableHeader>
              <TableRow>
                <TableHead>Adı Soyadı</TableHead>
                <TableHead>Mail</TableHead>
                <TableHead>Kalan</TableHead>
                <TableHead>Qr</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.remaininglessons}</TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        setQrCode({
                          open: true,
                          id: user.id,
                          userName: user.name,
                        })
                      }
                    >
                      Qr Göster
                    </Button>
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        setNewUserModal({
                          type: "update",
                          id: user.id,
                          open: true,
                          name: user.name,
                          email: user.email,
                          remaininglessons: user.remaininglessons,
                        })
                      }
                    >
                      Güncelle
                      <Edit />
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        user.remaininglessons === 3
                          ? setSure({ open: true, userId: user.id })
                          : handleLessonDecrement(user.id)
                      }
                    >
                      Ders Yaptı
                      <Check />
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        setDeleteSure({ open: true, userId: user.id })
                      }
                      // onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="invisible md:visible">
              A list of FitHouse.
            </TableCaption>
          </Table>
        ) : (
          <div className="border border-solid border-gray-500/20 w-full h-20 flex justify-center items-center">
            <span>Henüz Bir Müşteri Bulunmamaktadır.</span>
          </div>
        )}
        <div className="w-full">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() =>
                    currentPage !== 1 && setCurrentPage(currentPage - 1)
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>{currentPage}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={() =>
                    Math.ceil(users.length / usersPerPage) > currentPage &&
                    setCurrentPage(currentPage + 1)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        {sure.open && (
          <>
            <div
              className="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[4px] transition-opacity"
                aria-hidden="true"
              ></div>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                  <div className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-md shadow-slate-400 transition-all sm:my-8 sm:w-full sm:max-w-lg ">
                    <div className="bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                          <svg
                            className="size-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                            />
                          </svg>
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <h3
                            className="text-base font-semibold text-white"
                            id="modal-title"
                          >
                            Uyarı: Mail Gönderimi Onayı
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Bu işlem, kullanıcının ders kredilerinin
                              azaldığını belirten bir bilgilendirme e-postası
                              gönderecektir. Emin misiniz?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 sm:flex gap-4 sm:flex-row-reverse sm:px-6">
                      <Button
                        variant={"green"}
                        onClick={() => {
                          handleLessonDecrement(sure.userId as number);
                        }}
                        type="button"
                      >
                        Gönder
                        <Send />
                      </Button>
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => setSure({ open: false, userId: null })}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {deleteSure.open && (
          <>
            <div
              className="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[4px] transition-opacity"
                aria-hidden="true"
              ></div>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                  <div className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-md shadow-slate-400 transition-all sm:my-8 sm:w-full sm:max-w-lg ">
                    <div className="bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                          <svg
                            className="size-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                            />
                          </svg>
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <h3
                            className="text-base font-semibold text-white"
                            id="modal-title"
                          >
                            Uyarı: Kullanıcı Silme
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Kullanıcıyı silmek istediğinizden emin misiniz?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 sm:flex gap-4 sm:flex-row-reverse sm:px-6">
                      <Button
                        variant={"green"}
                        onClick={() => {
                          handleDeleteUser(deleteSure.userId as number);
                        }}
                        type="button"
                      >
                        Sil
                        <Trash2 />
                      </Button>
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          setDeleteSure({ open: false, userId: null })
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {newUserModal.open && (
          <>
            <div
              className="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[4px] transition-opacity"
                aria-hidden="true"
              ></div>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                  <div className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-md shadow-slate-400 transition-all w-full mb-40 sm:my-8 sm:w-full sm:max-w-lg ">
                    <div className="bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mx-4 w-full sm:mt-0 sm:text-left">
                          <h3
                            className="text-base font-semibold text-white"
                            id="modal-title"
                          >
                            Yeni Kullanıcı Ekle
                          </h3>
                          <div className="mt-4 w-full flex flex-col gap-3">
                            <div>
                              <label className="text-[12px]">Ad Soyad</label>
                              <Input
                                className="mt-1"
                                type="text"
                                placeholder="Ad Soyad"
                                value={newUserModal.name}
                                onChange={(e) =>
                                  setNewUserModal({
                                    ...newUserModal,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-[12px]">Mail</label>
                              <Input
                                className="mt-1"
                                type="email"
                                placeholder="Email"
                                value={newUserModal.email}
                                onChange={(e) =>
                                  setNewUserModal({
                                    ...newUserModal,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-[12px]">Ders Sayısı</label>
                              <Input
                                className="mt-1"
                                type="number"
                                placeholder="Ders Sayısı"
                                value={String(newUserModal.remaininglessons)}
                                onChange={(e) =>
                                  setNewUserModal({
                                    ...newUserModal,
                                    remaininglessons: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex gap-4 sm:flex-row-reverse sm:px-6">
                      <Button variant={"green"} onClick={handleNewUserSubmit}>
                        Kaydet
                        <Save />
                      </Button>
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          setNewUserModal({
                            type: "new",
                            open: false,
                            name: "",
                            email: "",
                            remaininglessons: "",
                          })
                        }
                      >
                        <SidebarClose />
                        Kapat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {qrCode.open && (
          <>
            <div
              className="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[4px] transition-opacity"
                aria-hidden="true"
              ></div>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                  <div
                    ref={divRef}
                    className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-md shadow-slate-400 transition-all w-full mb-40 sm:my-8 sm:w-[320px] "
                  >
                    <div className="bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="flex flex-col items-center gap-2 justify-center mt-3 text-center sm:mx-4 w-full sm:mt-0 sm:text-left">
                          <h3
                            className="text-base font-semibold text-white"
                            id="modal-title"
                          >
                            {qrCode.userName} Qr Code
                          </h3>
                          <div className="mt-4 w-fit flex flex-col gap-3 bg-white p-1">
                            <QRCode value={qrCode.id + ""} size={160} />
                          </div>
                          <div className="relative md:w-[220px] md:h-[130px] w-[220px] h-[120px]">
                            {/* <Image src="/fithouse.png" alt="fithouse" fill unoptimized /> */}
                            <img
                              src="/fithouse.png"
                              alt="fithouse"
                              width="220"
                              height="130"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "px-4 py-3 flex gap-4 sm:flex-row-reverse sm:px-6",
                        shareButton ? "hidden" : "flex"
                      )}
                    >
                      <Button variant={"green"} onClick={handleShareQrCode}>
                        İndir
                        <Share />
                      </Button>
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          setQrCode({
                            open: false,
                            id: null,
                            userName: "",
                          })
                        }
                      >
                        <SidebarClose />
                        Kapat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {custom.open && (
          <>
            <div
              className="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[4px] transition-opacity"
                aria-hidden="true"
              ></div>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                  <div className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-md shadow-slate-400 transition-all w-full my-8 sm:my-8 sm:w-full sm:max-w-lg ">
                    <div className="bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mx-4 w-full sm:mt-0 sm:text-left">
                          <h3
                            className="text-base font-semibold text-white"
                            id="modal-title"
                          >
                            Kişiye Özel Mail Gönder
                          </h3>
                          <div className="mt-4 w-full flex flex-col gap-3">
                            <div>
                              <label className="text-[12px]">Ad Soyad</label>
                              <Input
                                className="mt-1"
                                type="text"
                                placeholder="Ad Soyad"
                                value={custom.name}
                                onChange={(e) =>
                                  setCustom({
                                    ...custom,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-[12px]">Mail</label>
                              <Input
                                className="mt-1"
                                type="email"
                                placeholder="Email"
                                value={custom.email}
                                onChange={(e) =>
                                  setCustom({
                                    ...custom,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </div>
                            {Array.from({ length: 5 }, (_, index) => (
                              <div key={index + 1}>
                                <label className="text-[12px]">
                                  {index + 1}. Satır
                                </label>
                                <Input
                                  className="mt-1"
                                  type="text"
                                  placeholder={`${index + 1} Satır`}
                                  value={custom[`message${index + 1}`] || ""}
                                  onChange={(e) =>
                                    setCustom({
                                      ...custom,
                                      [`message${index + 1}`]: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex gap-4 sm:flex-row-reverse sm:px-6">
                      <Button variant={"green"} onClick={handleSendCustomMail}>
                        Gönder
                        <Send />
                      </Button>
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          setCustom({
                            open: false,
                            name: "",
                            email: "",
                            message1: "",
                            message2: "",
                            message3: "",
                            message4: "",
                            message5: "",
                          })
                        }
                      >
                        <SidebarClose />
                        Kapat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {allUsers.open && (
          <>
            <div
              className="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[4px] transition-opacity"
                aria-hidden="true"
              ></div>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                  <div className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-md shadow-slate-400 transition-all w-full my-8 sm:my-8 sm:w-full sm:max-w-lg ">
                    <div className="bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mx-4 w-full sm:mt-0 sm:text-left">
                          <h3
                            className="text-base font-semibold text-white"
                            id="modal-title"
                          >
                            Tüm Üyelere Mail Gönder
                          </h3>
                          <div className="mt-4 w-full flex flex-col gap-3">
                            {Array.from({ length: 5 }, (_, index) => (
                              <div key={index + 1}>
                                <label className="text-[12px]">
                                  {index + 1}. Satır
                                </label>
                                <Input
                                  className="mt-1"
                                  type="text"
                                  placeholder={`${index + 1} Satır`}
                                  value={allUsers[`message${index + 1}`] || ""}
                                  onChange={(e) =>
                                    setAllUsers({
                                      ...allUsers,
                                      [`message${index + 1}`]: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex gap-4 sm:flex-row-reverse sm:px-6">
                      <Button variant={"green"} onClick={handleSendAllMail}>
                        Gönder
                        <Send />
                      </Button>
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          setAllUsers({
                            open: false,
                            message1: "",
                            message2: "",
                            message3: "",
                            message4: "",
                            message5: "",
                          })
                        }
                      >
                        <SidebarClose />
                        Kapat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Button variant={"outline"} onClick={handleLogout}>
          Çıkış Yap
          <LogOut />
        </Button>
      </div>
    </div>
  );
}
