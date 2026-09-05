import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginService } from "../services/auth";
import { decodeJWT } from "../utils/jwt";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async (identifier, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await loginService({identifier,password});
            sessionStorage.setItem('@App:token', response.token);
            console.log("Resposta do Backend:", response);
            const payload = decodeJWT(response.token);

            if(payload?.primeiro_acesso){
                navigate('/primeiro-acesso');
            }else{
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            setError('Credenciais inválidas. Verifique seus dados e tente novamente.');
        }finally{
            setLoading(false);
        }
    }

    return { login, loading, error }
}