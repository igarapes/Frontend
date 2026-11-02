import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../../services/api';
import { decodeJWT } from '../../utils/jwt';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { maskCPF, maskPhone } from '../../utils/masks';

// Validação com Zod
const schema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(14, 'Telefone incompleto'),
  role: z.string().min(1, 'Selecione um perfil'),
  cpf: z.string().optional(),
  dataConsent: z.boolean().optional(),
});

export function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id; // Se tem ID na URL, estamos editando
  
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('@App:token');
  const loggedUserRole = token ? decodeJWT(token)?.role : null;
  const userToEdit = location.state?.user;

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', cpf: '', role: 'USUARIO', dataConsent: false }
  });

  useEffect(() => {
    if (isEditing && userToEdit) {
      setValue('name', userToEdit.name);
      setValue('email', userToEdit.email);
      setValue('phone', maskPhone(userToEdit.phone || ''));
      setValue('role', userToEdit.role.name);
      setValue('cpf', userToEdit.cpf);
    }
  }, [isEditing, userToEdit, setValue]);

  const onSubmit = async (data) => {
    if (!isEditing && !data.dataConsent) return alert('Consentimento obrigatório.');
    if (!isEditing && (!data.cpf || data.cpf.length < 14)) return alert('CPF inválido.');

    try {
      setLoading(true);
      const payload = {
        ...data,
        phone: data.phone.replace(/\D/g, ''),
        cpf: data.cpf?.replace(/\D/g, '')
      };

      if (isEditing) {
        delete payload.cpf;
        delete payload.dataConsent;
        await api.put(`/user/${id}`, payload);
        alert('Usuário atualizado com sucesso!');
      } else {
        await api.post('/user', payload);
        alert('Usuário cadastrado. A senha foi enviada por e-mail.');
      }
      navigate('/gestao-usuarios');
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Controller name="name" control={control} render={({ field }) => (
              <div>
                <Input label="Nome Completo" {...field} />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>
            )} />
            
            <Controller name="email" control={control} render={({ field }) => (
              <div>
                <Input label="E-mail" type="email" {...field} />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>
            )} />

            <Controller name="phone" control={control} render={({ field: { onChange, value } }) => (
              <div>
                <Input label="Telefone" value={value} onChange={(e) => onChange(maskPhone(e.target.value))} />
                {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
              </div>
            )} />

            <Controller name="cpf" control={control} render={({ field: { onChange, value } }) => (
              <div>
                <Input label="CPF" disabled={isEditing} value={value} onChange={(e) => onChange(maskCPF(e.target.value))} />
              </div>
            )} />

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Perfil de Acesso</label>
              <Controller name="role" control={control} render={({ field }) => (
                <select {...field} disabled={loggedUserRole === 'TECNICO' || isEditing} className="w-full px-4 py-2 border rounded-md">
                  {loggedUserRole === 'ADMIN' && (
                    <>
                      <option value="ADMIN">Administrador</option>
                      <option value="TECNICO">Técnico</option>
                    </>
                  )}
                  <option value="USUARIO">Usuário Comum</option>
                </select>
              )} />
            </div>
          </div>

          {/* Oculta o checkbox na edição */}
          {!isEditing && (
            <Controller name="dataConsent" control={control} render={({ field }) => (
              <label className="flex items-start mt-4 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded" checked={field.value} onChange={field.onChange} />
                <span className="ml-3 text-sm text-gray-700">
                  <strong className="block">Consentimento de Dados (Opt-in) *</strong>
                  Confirmo que o usuário consentiu com o uso de seus dados.
                </span>
              </label>
            )} />
          )}

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <button type="button" onClick={() => navigate('/gestao-usuarios')} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
              Cancelar
            </button>
            <div className="w-32">
              <Button type="submit" loading={loading}>{isEditing ? 'Salvar' : 'Criar'}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}