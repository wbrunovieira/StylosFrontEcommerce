"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, useFavoritesStore } from "@/context/store";
import { BsTrash } from "react-icons/bs";
import Button from "@/components/Button";
import { useState } from "react";

interface Product {
  id: string;
  quantity: number;
  title: string;
  image: string;
  price: number;
}

interface Address {
  _id: {
    value: string;
  };
  props: {
    userId: string;
    street: string;
    number: number;
    complement?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    createdAt: string;
    updatedAt: string;
  };
}

const UserPage: NextPage = () => {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [addresses, setAddresses] = useState<Address[]>([]);

  const favorited = useFavoritesStore((state: any) => state.favorites);
  const cartFavorited = useFavoritesStore((state: any) => state.cartFavorited);
  const removeFromFavorite = useFavoritesStore(
    (state: any) => state.removeFromFavorite
  );
  const addToCart = useCartStore((state: any) => state.addToCart);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/users/by-user-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          userId: session?.user?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
      } else {
        console.error("Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses", error);
    }
  };

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }
  console.log("favoritos", cartFavorited);

  return (
    <div className="container max-w-4xl mx-auto mt-10 p-8 bg-primaryLight rounded-xl shadow-lg z-20 ">
      <h1 className="text-2xl font-bold text-center mb-6">Perfil do Usuário</h1>
      <div className="flex gap-4 bg-primaryLight max-w-4xl ">
        <div className="bg-primaryLight pt-2  rounded">
          <p className="text-primaryDark ml-2">Favoritos :</p>
          <div>
            <div className="flex flex-col w-72 gap-4  bg-primaryLight rounded-md p-2">
              {cartFavorited.map((item: Product, index: number) => (
                <div
                  key={index}
                  className="p-4 rounded-md flex gap-2 divide-x divide-stone-200 border border-secondary "
                >
                  <div className="flex gap-2 divide-stone-200">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={50}
                      height={50}
                      className="rounded mb-2 object-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 ml-2">
                    <p className="text-xs text-primaryDark ml-2">
                      {item.title}
                    </p>

                    <div className="flex gap-2 ml-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            image: item.image,
                            quantity: item.quantity,
                            price: item.price,
                            title: item.title,
                          });
                          removeFromFavorite(item.id);
                        }}
                      >
                        Adcionar ao carrinho
                      </Button>
                      <button onClick={() => removeFromFavorite(item.id)}>
                        <BsTrash className="text-primaryDark cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {session.user?.image && (
            <div className="flex justify-center mb-4">
              <Image
                src={session.user.image}
                alt="Imagem do usuário"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          )}

          <div className="text-lg text-primaryDark w-[450px] bg-primary p-2 rounded-md ">
            {/* <div className="flex justify-center mb-4">
              <Image
                src={session.user.image} 
                alt="Imagem do usuário"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div> */}
            <p>
              Nome: <strong>{session.user?.name}</strong>
            </p>
            <p>
              Email: <strong>{session.user?.email}</strong>
            </p>
          </div>

          <form className="mt-6 max-w-[600px] border-2 border-secondary p-4 rounded-md">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-primaryDark"
                >
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  defaultValue={session.user?.name || ""}
                  className="mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-primaryDark "
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={session.user?.email || ""}
                  className="mt-1 block text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-primaryDark"
                >
                  Endereço
                </label>
                <input
                  id="address"
                  autoComplete="adress"
                  type="text"
                  placeholder="Endereço completo"
                  className="mt-1 text-primaryDark  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-primaryDark"
                >
                  Telefone
                </label>
                <input
                  id="phone"
                  autoComplete="phone"
                  type="tel"
                  placeholder="(99) 99999-9999"
                  className="mt-1 text-primaryDark w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryDark focus:border-primaryDark caret-secondary"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="bg-primaryDark text-primary hover:bg-primary hover:text-primaryDark font-bold py-2 px-4 rounded shadow-lg hover:shadow-xl transition duration-200"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-bold text-primaryDark">Endereços:</h2>
        {addresses.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {addresses.map((address, index) => (
              <li
                key={index}
                className="border border-secondary p-4 rounded-md"
              >
                <p>
                  <strong>Rua:</strong> {address.props.street},{" "}
                  {address.props.number}
                </p>
                {address.props.complement && (
                  <p>
                    <strong>Complemento:</strong> {address.props.complement}
                  </p>
                )}
                <p>
                  <strong>Cidade:</strong> {address.props.city}
                </p>
                <p>
                  <strong>Estado:</strong> {address.props.state}
                </p>
                <p>
                  <strong>País:</strong> {address.props.country}
                </p>
                <p>
                  <strong>CEP:</strong> {address.props.zipCode}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum endereço encontrado.</p>
        )}
      </div>
      <div className="mt-10 flex justify-between">
        <Link
          href="/"
          className="text-primaryLight hover:underline bg-secondary p-2 rounded transition duration-300 hover:scale-105"
        >
          Voltar para Home
        </Link>
        <Link
          href="/cart"
          className="text-primaryLight hover:underline bg-secondary p-2 rounded transition duration-300 hover:scale-105"
        >
          Ver Carrinho
        </Link>
      </div>
    </div>
  );
};

export default UserPage;
