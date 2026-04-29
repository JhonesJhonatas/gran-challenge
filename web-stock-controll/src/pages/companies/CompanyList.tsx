import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { getApiError } from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import type { Company } from '../../types/company';

const CONTACT_LABEL: Record<string, string> = {
  email: 'E-mail',
  phone_number: 'Telefone',
};

export function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const fetchCompanies = useCallback(async () => {
    try {
      setCompanies(await companyService.getAll());
    } catch (err) {
      showToast(getApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { void fetchCompanies(); }, [fetchCompanies]);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await companyService.remove(deleteId);
      setCompanies((prev) => prev.filter((c) => c.id !== deleteId));
      showToast('Fornecedor excluído com sucesso!', 'success');
    } catch (err) {
      showToast(getApiError(err), 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={hideToast} />}
      {deleteId !== null && (
        <ConfirmDialog
          message="Tem certeza que deseja excluir este fornecedor?"
          onConfirm={() => void handleDelete()}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Fornecedores</h1>
        <Link
          to="/companies/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Novo Fornecedor
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">Nenhum fornecedor cadastrado.</p>
          <Link to="/companies/new" className="text-blue-600 hover:underline text-sm">
            Cadastrar o primeiro fornecedor
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Nome', 'CNPJ', 'Telefone', 'E-mail', 'Contato Principal', 'Ações'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{company.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{company.cnpj}</td>
                  <td className="px-4 py-3 text-gray-600">{company.phone_number}</td>
                  <td className="px-4 py-3 text-gray-600">{company.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {CONTACT_LABEL[company.main_contact] ?? company.main_contact}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/companies/${company.id}/edit`}
                        className="px-3 py-1 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => setDeleteId(company.id)}
                        className="px-3 py-1 text-xs rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
