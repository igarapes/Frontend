import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Input } from '../../components/input';
import { Button } from '../../components/button';

export function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(identifier, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Acesso ao Sistema</h2>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    <Input
                        label="CPF ou Email"
                        id="identifier"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <Input
                        label="Senha"
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="pt-2">
                        <Button type="submit" loading={loading}>
                            Entrar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}