import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { associationService } from '../../services/associationService';
import { companyService } from '../../services/companyService';
import { productService } from '../../services/productService';
import { getApiError } from '../../services/api';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import type { Company } from '../../types/company';
import type { Product } from '../../types/product';

export function AssociationPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [associated, setAssociated] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [prod, linked, companies] = await Promise.all([
        productService.getById(productId),
        associationService.getCompaniesByProduct(productId),
        companyService.getAll(),
      ]);
      setProduct(prod);
      setAssociated(linked);
      setAllCompanies(companies);
    } catch (err) {
      showToast(getApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [productId, showToast]);

  useEffect(() => { void load(); }, [load]);

  const available = allCompanies.filter((c) => !associated.some((a) => a.id === c.id));

  const handleAssociate = async () => {
    if (!selectedCompanyId) return;
    try {
      await associationService.associate(productId, Number(selectedCompanyId));
      showToast('Fornecedor associado com sucesso ao produto!', 'success');
      setSelectedCompanyId('');
      await load();
    } catch (err) {
      showToast(getApiError(err), 'error');
    }
  };

  const handleDisassociate = async (companyId: number) => {
    try {
      await associationService.disassociate(productId, companyId);
      showToast('Fornecedor desassociado com sucesso!', 'success');
      setAssociated((prev) => prev.filter((c) => c.id !== companyId));
    } catch (err) {
      showToast(getApiError(err), 'error');
    }
  };

  if (loading) return <p className="text-gray-500">Carregando...</p>;

  return (
    <>
      {toast && <Toast {...toast} onClose={hideToast} />}

      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
        >
          ← Voltar
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Fornecedores do Produto</h1>
      </div>

      {product && (
        <p className="text-gray-500 text-sm mb-6">
          {product.name}
          {' · '}
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{product.category}</span>
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-900">
              Fornecedores Associados ({associated.length})
            </h2>
          </div>
          {associated.length === 0 ? (
            <p className="px-5 py-8 text-gray-400 text-sm text-center">
              Nenhum fornecedor associado.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                    Nome
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                    CNPJ
                  </th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {associated.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{company.name}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{company.cnpj}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => void handleDisassociate(company.id)}
                        className="px-3 py-1 text-xs rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Desassociar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-medium text-gray-900 mb-4">Associar Novo Fornecedor</h2>
          {available.length === 0 ? (
            <p className="text-gray-400 text-sm">
              {allCompanies.length === 0
                ? 'Nenhum fornecedor cadastrado. Cadastre fornecedores primeiro.'
                : 'Todos os fornecedores já estão associados a este produto.'}
            </p>
          ) : (
            <div className="space-y-3">
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um fornecedor...</option>
                {available.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.cnpj}
                  </option>
                ))}
              </select>
              <button
                onClick={() => void handleAssociate()}
                disabled={!selectedCompanyId}
                className="w-full px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Associar Fornecedor
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
