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
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  remainingLessons: number;
}

interface SureType {
  open: boolean;
  userId: number | null;
}

interface NewUserModal {
  id?: number | null;
  type: "new" | "update";
  open: boolean;
  name: string;
  email: string;
  remainingLessons: number | "";
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sure, setSure] = useState<SureType>({ open: false, userId: null });
  const [customUsers, setCustomUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [newUserModal, setNewUserModal] = useState<NewUserModal>({
    type: "new",
    id: null,
    open: false,
    name: "",
    email: "",
    remainingLessons: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
      setCustomUsers(data);
    };
    fetchUsers();
  }, []);

  const updateUsers = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setCustomUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleLessonDecrement = async (userId: number) => {
    const manuelCondition = users.find((user) => user.id === userId);

    if (!manuelCondition) {
      alert("Kullanıcı bulunamadı.");
      return;
    }

    if (manuelCondition && manuelCondition.remainingLessons <= 0) {
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
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId && user.remainingLessons > 0
                ? { ...user, remainingLessons: user.remainingLessons - 1 }
                : user
            )
          );
          setCustomUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId && user.remainingLessons > 0
                ? { ...user, remainingLessons: user.remainingLessons - 1 }
                : user
            )
          );
          setSure({ open: false, userId: null });
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    if (inputValue === "") {
      setCustomUsers(users);
    } else {
      const filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          user.email.toLowerCase().includes(inputValue.toLowerCase())
      );
      setCustomUsers(filteredUsers);
    }
  }, [inputValue, users]);

  const handleNewUserSubmit = async () => {
    console.log(newUserModal, "newUserModal");
    const { name, email, remainingLessons } = newUserModal;

    if (!name || !email || !remainingLessons) {
      alert("Tüm alanları doldurunuz.");
      return;
    }

    if (newUserModal.type === "new") {
      const newUser: User = {
        id: users.length + 1,
        name,
        email,
        remainingLessons: Number(remainingLessons),
      };

      await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
        .then((result) => {
          if (result.ok) {
            setUsers((prev) => [...prev, newUser]);
            setCustomUsers((prev) => [...prev, newUser]);
            setNewUserModal({
              type: "new",
              open: false,
              name: "",
              email: "",
              remainingLessons: "",
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
        remainingLessons: Number(remainingLessons),
      };

      await fetch("/api/users/update/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      })
        .then((result) => {
          if (result.ok) {
            updateUsers(updatedUser);
            setNewUserModal({
              type: "update",
              id: null,
              open: false,
              name: "",
              email: "",
              remainingLessons: "",
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const usersPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);

  useEffect(() => {
    setCurrentPage(1);
    const paginated = customUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );
    setPaginatedUsers(paginated);
  }, [customUsers]);

  useEffect(() => {
    const paginated = customUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );
    setPaginatedUsers(paginated);
  }, [currentPage]);

  return (
    <div className="flex min-h-[100vh] w-full !items-center flex-col gap-12">
      <div>
        <Image
          src="https://www.fithousetrainingstudio.com/images/logo/6214858539465-672-fithouse-footer-logo.png"
          alt="fithouse"
          width={320}
          height={180}
        />
      </div>
      <div className="max-w-[800px] w-full flex flex-col gap-6">
        <div className="flex gap-4 justify-between">
          <div className="w-1/2">
            <Input
              type="text"
              placeholder="Ara..."
              className="w-full"
              onChange={handleInputValue}
            />
          </div>
          <div className="w-1/2 flex justify-end">
            <Button
              variant="outlineGreen"
              onClick={() =>
                setNewUserModal({ ...newUserModal, open: true, type: "new" })
              }
            >
              Ekle
            </Button>
          </div>
        </div>
        <Table>
          <TableCaption>A list of FitHouse.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Adı Soyadı</TableHead>
              <TableHead>Mail</TableHead>
              <TableHead>Kalan</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.remainingLessons}</TableCell>
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
                        remainingLessons: user.remainingLessons,
                      })
                    }
                  >
                    Güncelle
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() =>
                      user.remainingLessons === 3
                        ? setSure({ open: true, userId: user.id })
                        : handleLessonDecrement(user.id)
                    }
                  >
                    Ders Yaptı
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="w-full">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() => setCurrentPage(currentPage - 1)}
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
                  onClick={() => setCurrentPage(currentPage + 1)}
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
                  <div className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-md shadow-slate-400 transition-all sm:my-8 sm:w-full sm:max-w-lg ">
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
                                value={String(newUserModal.remainingLessons)}
                                onChange={(e) =>
                                  setNewUserModal({
                                    ...newUserModal,
                                    remainingLessons: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 sm:flex gap-4 sm:flex-row-reverse sm:px-6">
                      <Button variant={"green"} onClick={handleNewUserSubmit}>
                        Kaydet
                      </Button>
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          setNewUserModal({
                            type: "new",
                            open: false,
                            name: "",
                            email: "",
                            remainingLessons: "",
                          })
                        }
                      >
                        Kapat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
