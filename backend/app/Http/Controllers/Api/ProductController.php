<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Api;

class ProductController extends Controller

{
    // GET: Menampilkan semua produk
    public function index()
    {
        $products = DB::table('products')
            ->select(
                'ID',
                'kode',
                'nama',
                'desc_',
                'photo',
                'jenis_kertas',
                'ukuran_kertas',
                'aktif'
            )
            ->orderBy('nama')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    // GET: Detail produk berdasarkan ID
    public function show($id)
    {
        $product = DB::table('products')
            ->select(
                'ID',
                'kode',
                'nama',
                'desc_',
                'photo',
                'jenis_kertas',
                'ukuran_kertas',
                'aktif'
            )
            ->where('ID', $id)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Data produk tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    // POST: Menambahkan produk baru
    
	// POST: Menambahkan produk baru beserta foto
	public function store(Request $request)
	{
	    $validated = $request->validate([
	        'kode' => [
	            'required',
	            'string',
	            'max:100',
	            Rule::unique('products', 'kode'),
	        ],
	        'nama' => ['required', 'string', 'max:255'],
	        'desc_' => ['nullable', 'string'],
	
	        // Upload foto JPG/JPEG maksimal 5 MB
	        'photo' => ['nullable', 'image', 'mimes:jpg,jpeg', 'max:5120'],
	
	        'jenis_kertas' => [
	            'required',
	            'integer',
	            Rule::exists('bahan', 'ID'),
	        ],
	
	        'ukuran_kertas' => [
	            'required',
	            'integer',
	            Rule::exists('gramasi', 'ID'),
	        ],
	
	        'aktif' => ['required', 'boolean'],
	    ]);
	
	    // 1. Simpan data produk terlebih dahulu
	    $id = DB::table('products')->insertGetId([
	        'kode' => $validated['kode'],
	        'nama' => $validated['nama'],
	        'desc_' => $validated['desc_'] ?? null,
	        'photo' => null,
	        'jenis_kertas' => $validated['jenis_kertas'],
	        'ukuran_kertas' => $validated['ukuran_kertas'],
	        'aktif' => $validated['aktif'],
	    ], 'ID');
	
	    // 2. Simpan foto menggunakan ID produk
	    if ($request->hasFile('photo')) {
	        $filename = $id . '.jpg';
	
	        $request->file('photo')->storeAs(
	            'uploads',
	            $filename,
	            'public'
	        );
	
	        // 3. Simpan nama file ke kolom photo
	        DB::table('products')
	            ->where('ID', $id)
	            ->update([
	                'photo' => $filename
	            ]);
	    }
	
	    // 4. Ambil data produk yang sudah tersimpan
	    $product = DB::table('products')
	        ->select(
	            'ID',
	            'kode',
	            'nama',
	            'desc_',
	            'photo',
	            'jenis_kertas',
	            'ukuran_kertas',
	            'aktif'
	        )
	        ->where('ID', $id)
	        ->first();
	
	    return response()->json([
	        'success' => true,
	        'message' => 'Produk berhasil ditambahkan',
	        'data' => $product
	    ], 201);
	}	


    
// PUT/PATCH: Memperbarui produk beserta foto
	public function update(Request $request, $id)
	{
	    $product = DB::table('products')
	        ->where('ID', $id)
	        ->first();
	
	    if (!$product) {
	        return response()->json([
	            'success' => false,
	            'message' => 'Data produk tidak ditemukan'
	        ], 404);
	    }
	
	    $validated = $request->validate([
	        'kode' => [
	            'required',
	            'string',
	            'max:100',
	            Rule::unique('products', 'kode')->ignore($id, 'ID'),
	        ],
	        'nama' => ['required', 'string', 'max:255'],
	        'desc_' => ['nullable', 'string'],
	        'photo' => ['nullable', 'image', 'mimes:jpg,jpeg', 'max:5120'],
	
	        'jenis_kertas' => [
	            'required',
	            'integer',
	            Rule::exists('bahan', 'ID'),
	        ],
	
	        'ukuran_kertas' => [
	            'required',
	            'integer',
	            Rule::exists('gramasi', 'ID'),
	        ],
	
	        'aktif' => ['required', 'boolean'],
	    ]);
	
	    // Update data produk selain foto
	    DB::table('products')
	        ->where('ID', $id)
	        ->update([
	            'kode' => $validated['kode'],
	            'nama' => $validated['nama'],
	            'desc_' => $validated['desc_'] ?? null,
	            'jenis_kertas' => $validated['jenis_kertas'],
	            'ukuran_kertas' => $validated['ukuran_kertas'],
	            'aktif' => $validated['aktif'],
	        ]);
	
	    // Jika pengguna memilih foto baru
	    if ($request->hasFile('photo')) {
	
	        $filename = $id . '.jpg';
	
	        // Hapus foto lama jika ada
	        Storage::disk('public')->delete(
	            'uploads/' . $filename
	        );
	
	        // Simpan foto baru
	        $request->file('photo')->storeAs(
	            'uploads',
	            $filename,
	            'public'
	        );
	
	        // Update nama foto di database
	        DB::table('products')
	            ->where('ID', $id)
	            ->update([
	                'photo' => $filename
	            ]);
	    }
	
	    $updatedProduct = DB::table('products')
	        ->select(
	            'ID',
	            'kode',
	            'nama',
	            'desc_',
	            'photo',
	            'jenis_kertas',
	            'ukuran_kertas',
	            'aktif'
	        )
	        ->where('ID', $id)
	        ->first();
	
	    return response()->json([
	        'success' => true,
	        'message' => 'Produk berhasil diperbarui',
	        'data' => $updatedProduct
	    ]);
	}



	// DELETE: Menghapus produk beserta foto
	public function destroy($id)
	{
	    $product = DB::table('products')
	        ->where('ID', $id)
	        ->first();
	
	    if (!$product) {
	        return response()->json([
	            'success' => false,
	            'message' => 'Data produk tidak ditemukan'
	        ], 404);
	    }
	
	    // Hapus file foto jika ada
	    if ($product->photo) {
	        Storage::disk('public')->delete(
	            'uploads/' . $product->photo
	        );
	    }
	
	    // Hapus data produk
	    DB::table('products')
	        ->where('ID', $id)
	        ->delete();
	
	    return response()->json([
	        'success' => true,
	        'message' => 'Produk berhasil dihapus'
	    ]);
	}

}

