@model IEnumerable<MonAn>
@inject Microsoft.AspNetCore.Http.IHttpContextAccessor HttpContextAccessor

@{
    Layout = "~/Views/Shared/_Layout.cshtml";
    ViewData["Title"] = "Quản lý Sản phẩm";
}

<div class="search-bar">
    <form asp-action="QuanLySanPham" asp-controller="MonAns" method="get" class="d-flex">
        <input class="form-control me-2 search-input" type="search" name="TimKiem" placeholder="Tìm kiếm..." aria-label="Search">
        <button class="btn btn-outline-success d-flex align-items-center justify-content-center" style="width: 130px; gap: 5px;" type="submit">
            <ion-icon name="search"></ion-icon> Tìm Kiếm
        </button>
    </form>
</div>

<h2 class="text-center mt-4">Quản lý Sản phẩm</h2>

<div class="d-flex justify-content-between mb-3">

    
        <a asp-action="Create" class="btn btn-success">➕ Thêm sản phẩm</a>
    
    <a asp-action="Index" class="btn btn-secondary">⬅ Quay lại danh sách</a>
</div>

<table class="table table-bordered">
    <thead class="table-dark">
        <tr>
            <th>Tên Món</th>
            <th>Loại Sản Phẩm</th>
            <th>Giá</th>
            <th>Số Lượng</th>
            <th>Hành Động</th>
        </tr>
    </thead>
    <tbody>
        @foreach (var item in Model)
        {
            <tr>
                <td>@item.TenMon</td>
                <td>@item.LoaiSanPham</td>
                <td>@item.Gia.ToString("N3") VNĐ</td>
                <td>
                    
                    
                        <form asp-action="CapNhatSoLuong" asp-controller="MonAns" method="post" class="d-flex">
                            <input type="hidden" name="id" value="@item.MaMon" />
                            <input type="number" name="soLuong" value="@item.SoLuong" min="0" class="form-control w-50 me-2" />
                            <button type="submit" class="btn btn-primary">💾 Lưu</button>
                        </form>
                </td>
                
                    <td>
                        
                        
                            <a asp-action="Edit" asp-route-id="@item.MaMon" class="btn btn-warning">✏ Sửa</a>
                            <a asp-action="Delete" asp-route-id="@item.MaMon" class="btn btn-danger"
                               onclick="return confirmDelete(@item.MaMon);">🗑 Xóa</a>
                       
                        
                            <a asp-action="Details" asp-route-id="@item.MaMon" class="btn btn-info">🔍 Chi tiết</a>
                        
                    </td>
            </tr>
        }
    </tbody>
</table>

@section Scripts {
    <script>
        function confirmDelete(id) {
            return confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
        }
    </script>
}