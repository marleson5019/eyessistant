import React, { createContext, useContext, useState } from "react";

interface CadastroForm {
  nome: string;
  setNome: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  cpf: string;
  setCpf: (v: string) => void;
  nascimento: string;
  setNascimento: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  senha: string;
  setSenha: (v: string) => void;
  confirmarSenha: string;
  setConfirmarSenha: (v: string) => void;
}

const CadastroFormContext = createContext<CadastroForm | undefined>(undefined);

export function CadastroFormProvider({ children }: { children: React.ReactNode }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  return (
    <CadastroFormContext.Provider value={{
      nome, setNome,
      email, setEmail,
      cpf, setCpf,
      nascimento, setNascimento,
      telefone, setTelefone,
      senha, setSenha,
      confirmarSenha, setConfirmarSenha
    }}>
      {children}
    </CadastroFormContext.Provider>
  );
}

export function useCadastroForm() {
  const ctx = useContext(CadastroFormContext);
  if (!ctx) throw new Error("useCadastroForm precisa estar dentro do CadastroFormProvider");
  return ctx;
}
