<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UkuranController extends Controller
{
    // GET: Menampilkan semua ukuran gramasi
    public function index()
    {
        $ukuran = DB::table('db_design.gramasi')
            ->select('ID', 'ukuran', 'satuan', 'aktif')
            ->orderBy('ukuran')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $ukuran
        ]);
    }

    // GET: Detail ukuran berdasarkan ID
    public function show($id)
    {
        $ukuran = DB::table('db_design.gramasi')
            ->select('ID', 'ukuran', 'satuan', 'aktif')
            ->where('ID', $id)
            ->first();

        if (!$ukuran) {
            return response()->json([
                'success' => false,
                'message' => 'Data ukuran gramasi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ukuran
        ]);
    }

    // POST: Menambahkan ukuran gramasi
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ukuran' => ['required', 'numeric', 'min:0'],
            'satuan' => ['required', 'string', 'max:50'],
            'aktif'  => ['required', 'boolean'],
        ]);

        $id = DB::table('db_design.gramasi')->insertGetId([
            'ukuran' => $validated['ukuran'],
            'satuan' => $validated['satuan'],
            'aktif'  => $validated['aktif'],
        ], 'ID');

        $data = DB::table('db_design.gramasi')
            ->select('ID', 'ukuran', 'satuan', 'aktif')
            ->where('ID', $id)
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Ukuran gramasi berhasil ditambahkan',
            'data' => $data
        ], 201);
    }

    // PUT/PATCH: Memperbarui ukuran gramasi
    public function update(Request $request, $id)
    {
        $exists = DB::table('db_design.gramasi')
            ->where('ID', $id)
            ->exists();

        if (!$exists) {
            return response()->json([
                'success' => false,
                'message' => 'Data ukuran gramasi tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'ukuran' => ['required', 'numeric', 'min:0'],
            'satuan' => ['required', 'string', 'max:50'],
            'aktif'  => ['required', 'boolean'],
        ]);

        DB::table('db_design.gramasi')
            ->where('ID', $id)
            ->update([
                'ukuran' => $validated['ukuran'],
                'satuan' => $validated['satuan'],
                'aktif'  => $validated['aktif'],
            ]);

        $data = DB::table('db_design.gramasi')
            ->select('ID', 'ukuran', 'satuan', 'aktif')
            ->where('ID', $id)
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Ukuran gramasi berhasil diperbarui',
            'data' => $data
        ]);
    }

    // DELETE: Menghapus ukuran gramasi
    public function destroy($id)
    {
        $deleted = DB::table('db_design.gramasi')
            ->where('ID', $id)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Data ukuran gramasi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Ukuran gramasi berhasil dihapus'
        ]);
    }
}
