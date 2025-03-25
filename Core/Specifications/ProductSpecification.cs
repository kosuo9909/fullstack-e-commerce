using System.Security.Cryptography.X509Certificates;
using Core.Entities;

namespace Core.Specifications;

public class ProductSpecification : BaseSpecifications<Product>
{
    public ProductSpecification(ProductSpecParams specParams) : base(p =>
        (!specParams.Brands.Any() || specParams.Brands.Contains(p.Brand)) &&
        (!specParams.Types.Any() || specParams.Types.Contains(p.Type))
    )
    {

        ApplyPaging(specParams.PageSize * (specParams.PageIndex - 1), specParams.PageSize);

        switch (specParams.Sort)
        {
            case "priceAsc":
                AddOrderBy(p => p.Price);
                break;
            case "priceDesc":
                AddOrderByDescending(p => p.Price);
                break;
            default:
                AddOrderBy(p => p.Name);
                break;
        }

    }

}
