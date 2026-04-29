import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IMaskInput } from 'react-imask';
import { companyService } from '../../services/companyService';
import { getApiError } from '../../services/api';
import { Toast } from '../../components/Toast';
import { FormError } from '../../components/FormError';
import { useToast } from '../../hooks/useToast';

const schema = z.object({
  name: z.string().min(1, 'Nome da empresa é obrigatório'),
  cnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato 00.000.000/0000-00'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  phone_number: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Telefone deve estar no formato (00) 0000-0000',
    ),
  email: z.string().email('E-mail inválido'),
  main_contact: z.enum(['email', 'phone_number'], {
    error: 'Selecione um contato principal',
  }),
});

type FormValues = z.infer<typeof schema>;

const FIELD_CLASS =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1';

const PHONE_MASKS = [{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }];

export function CompanyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!isEdit || !id) return;
    companyService
      .getById(Number(id))
      .then((c) => {
        reset({
          name: c.name,
          cnpj: c.cnpj,
          address: c.address,
          phone_number: c.phone_number,
          email: c.email,
          main_contact: c.main_contact,
        });
      })
      .catch((err: unknown) => showToast(getApiError(err), 'error'));
  }, [id, isEdit, reset, showToast]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit) {
        await companyService.update(Number(id), values);
        showToast('Fornecedor atualizado com sucesso!', 'success');
      } else {
        await companyService.create(values);
        showToast('Fornecedor cadastrado com sucesso!', 'success');
        setTimeout(() => navigate('/companies'), 1500);
      }
    } catch (err) {
      showToast(getApiError(err), 'error');
    }
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={hideToast} />}

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/companies')}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h1>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4"
        >
          <div>
            <label className={LABEL_CLASS}>Nome da Empresa *</label>
            <input {...register('name')} className={FIELD_CLASS} placeholder="Razão Social" />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <label className={LABEL_CLASS}>CNPJ *</label>
            <Controller
              name="cnpj"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  mask="00.000.000/0000-00"
                  value={field.value ?? ''}
                  onAccept={(val: string) => field.onChange(val)}
                  onBlur={field.onBlur}
                  className={FIELD_CLASS}
                  placeholder="00.000.000/0000-00"
                />
              )}
            />
            <FormError message={errors.cnpj?.message} />
          </div>

          <div>
            <label className={LABEL_CLASS}>Endereço *</label>
            <input
              {...register('address')}
              className={FIELD_CLASS}
              placeholder="Rua, número, cidade — estado"
            />
            <FormError message={errors.address?.message} />
          </div>

          <div>
            <label className={LABEL_CLASS}>Telefone *</label>
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <IMaskInput
                  mask={PHONE_MASKS}
                  value={field.value ?? ''}
                  onAccept={(val: string) => field.onChange(val)}
                  onBlur={field.onBlur}
                  className={FIELD_CLASS}
                  placeholder="(00) 0000-0000"
                />
              )}
            />
            <FormError message={errors.phone_number?.message} />
          </div>

          <div>
            <label className={LABEL_CLASS}>E-mail *</label>
            <input
              {...register('email')}
              type="email"
              className={FIELD_CLASS}
              placeholder="contato@empresa.com.br"
            />
            <FormError message={errors.email?.message} />
          </div>

          <div>
            <label className={LABEL_CLASS}>Contato Principal *</label>
            <select {...register('main_contact')} className={FIELD_CLASS}>
              <option value="">Selecione...</option>
              <option value="email">E-mail</option>
              <option value="phone_number">Telefone</option>
            </select>
            <FormError message={errors.main_contact?.message} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/companies')}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? 'Salvando...'
                : isEdit
                  ? 'Salvar Alterações'
                  : 'Cadastrar Fornecedor'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
