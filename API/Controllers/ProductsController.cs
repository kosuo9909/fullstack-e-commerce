using System;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IGenericRepository<Product> repo) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(string? brand, string? type, string? sort)
    {

        var spec = new ProductSpecification(brand, type, sort);

        var products = await repo.ListAsync(spec);
        return Ok(products);
    }


    [HttpGet("{id:int}")] // api/products/id
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);

        if (product == null) return NotFound();

        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        repo.Add(product);

        if (await repo.SaveAllAsync())
        {
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        return product;
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, Product product)
    {

        if (product.Id != id || !ProductExists(id)) return BadRequest("Cannot update this product");

        repo.Update(product);

        if (await repo.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("An error occurred updating the product");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);

        if (product == null) return NotFound();

        repo.Remove(product);

        if (await repo.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("An error occurred deleting the product");
    }

    // [HttpGet("brands")]
    // public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    // {
    //     // TODO: Implement this method
    //     return Ok();
    // }

    // [HttpGet("types")]
    // public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    // {
    //     // TODO: Implement this method
    //     return Ok();
    // }

    private bool ProductExists(int id) => repo.Exists(id);
}