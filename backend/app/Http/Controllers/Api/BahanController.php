<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class BahanController extends Controller
{
    // GET: Menampilkan semua bahan
    public function index()
    {
        $bahan = DB::table('db_design.bahan')
            ->select('ID', 'Nama', 'ket', 'Harga', 'aktif')
            ->orderBy('Nama')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $bahan
        ]);
    }

    // GET: Menampilkan satu bahan berdasarkan ID
    public function show($id)
    {
        $bahan = DB::table('db_design.bahan')
            ->select('ID', 'Nama', 'ket', 'Harga', 'aktif')
            ->where('ID', $id)
            ->first();

        if (!$bahan) {
            return response()->json([
                'success' => false,
                'message' => 'Data bahan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $bahan
        ]);
    }

    // POST: Input bahan baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nama'  => ['required', 'string', 'max:255'],
            'ket'   => ['nullable', 'string'],
            'Harga' => ['required', 'numeric', 'min:0'],
            'aktif' => ['required', 'boolean'],
        ]);

        $id = DB::table('db_design.bahan')->insertGetId([
            'Nama'  => $validated['Nama'],
            'ket'   => $validated['ket'] ?? null,
            'Harga' => $validated['Harga'],
            'aktif' => $validated['aktif'],
        ], 'ID');

        $bahan = DB::table('db_design.bahan')
            ->select('ID', 'Nama', 'ket', 'Harga', 'aktif')
            ->where('ID', $id)
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Bahan berhasil ditambahkan',
            'data' => $bahan
        ], 201);
    }

    // PUT/PATCH: Memperbarui bahan
    public function update(Request $request, $id)
    {
        $exists = DB::table('db_design.bahan')
            ->where('ID', $id)
            ->exists();

        if (!$exists) {
            return response()->json([
                'success' => false,
                'message' => 'Data bahan tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'Nama'  => ['required', 'string', 'max:255'],
            'ket'   => ['nullable', 'string'],
            'Harga' => ['required', 'numeric', 'min:0'],
            'aktif' => ['required', 'boolean'],
        ]);

        DB::table('db_design.bahan')
            ->where('ID', $id)
            ->update([
                'Nama'  => $validated['Nama'],
                'ket'   => $validated['ket'] ?? null,
                'Harga' => $validated['Harga'],
                'aktif' => $validated['aktif'],
            ]);

        $bahan = DB::table('db_design.bahan')
            ->select('ID', 'Nama', 'ket', 'Harga', 'aktif')
            ->where('ID', $id)
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Bahan berhasil diperbarui',
            'data' => $bahan
        ]);
    }

    // DELETE: Menghapus bahan
    public function destroy($id)
    {
        $deleted = DB::table('db_design.bahan')
            ->where('ID', $id)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Data bahan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Bahan berhasil dihapus'
        ]);
    }
}
