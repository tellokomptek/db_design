<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BahanController extends Controller
{
    // GET: Menampilkan semua bahan
    public function index()
    {
        $bahan = DB::table('bahan')
            ->select('ID', 'Nama', 'ket', 'photo', 'Harga', 'aktif')
            ->orderBy('ID')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $bahan
        ]);
    }

    // GET: Menampilkan satu bahan berdasarkan ID
    public function show($id)
    {
        $bahan = DB::table('bahan')
            ->select('ID', 'Nama', 'ket', 'photo', 'Harga', 'aktif')
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
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg', 'max:5120'],
        ]);

        // Simpan data bahan terlebih dahulu
        $id = DB::table('bahan')->insertGetId([
            'Nama'  => $validated['Nama'],
            'ket'   => $validated['ket'] ?? null,
            'photo' => null,
            'Harga' => $validated['Harga'],
            'aktif' => $validated['aktif'],
        ], 'ID');

        // Upload foto jika tersedia
        if ($request->hasFile('photo')) {

            $filename = $id . '.jpg';

            $request->file('photo')->storeAs(
                'uploads',
                $filename,
                'public'
            );

            DB::table('bahan')
                ->where('ID', $id)
                ->update([
                    'photo' => $filename
                ]);
        }

        // Ambil kembali data bahan
        $bahan = DB::table('bahan')
            ->select('ID', 'Nama', 'ket', 'photo', 'Harga', 'aktif')
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
        $exists = DB::table('bahan')
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
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg', 'max:5120'],
        ]);

        // Update data utama tanpa mengubah foto
        DB::table('bahan')
            ->where('ID', $id)
            ->update([
                'Nama'  => $validated['Nama'],
                'ket'   => $validated['ket'] ?? null,
                'Harga' => $validated['Harga'],
                'aktif' => $validated['aktif'],
            ]);

        // Jika user memilih foto baru
        if ($request->hasFile('photo')) {

            $filename ='B' . $id . '.jpg';

            // Hapus foto lama jika tersedia
            if (Storage::disk('public')->exists('uploads/' . $filename)) {
                Storage::disk('public')->delete('uploads/' . $filename);
            }

            // Simpan foto pengganti
            $request->file('photo')->storeAs(
                'uploads',
                $filename,
                'public'
            );

            // Update nama file foto di database
            DB::table('bahan')
                ->where('ID', $id)
                ->update([
                    'photo' => $filename
                ]);
        }

        // Ambil data terbaru
        $bahan = DB::table('bahan')
            ->select('ID', 'Nama', 'ket', 'photo', 'Harga', 'aktif')
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
        $bahan = DB::table('bahan')
            ->where('ID', $id)
            ->first();

        if (!$bahan) {
            return response()->json([
                'success' => false,
                'message' => 'Data bahan tidak ditemukan'
            ], 404);
        }

        // Hapus foto jika tersedia
        if (!empty($bahan->photo)) {
            $path = 'uploads/' . $bahan->photo;

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        // Hapus data bahan
        DB::table('bahan')
            ->where('ID', $id)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bahan berhasil dihapus'
        ]);
    }
}
