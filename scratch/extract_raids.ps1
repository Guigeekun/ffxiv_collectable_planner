$content = Get-Content 'C:\Users\Guigeek\.gemini\antigravity-ide\brain\5188bbbb-b6a6-4fbf-ab5c-2b6376cfbd48\.system_generated\steps\89\content.md' -Raw
# The JSON is on the line starting with {"query"
$jsonStart = $content.IndexOf('{"query"')
if ($jsonStart -lt 0) {
    # If not found, let's try fetching the API directly or checking other locations
    Write-Host "JSON start not found in step 89, fetching from FFXIV Collect API"
    $response = Invoke-RestMethod -Uri "https://ffxivcollect.com/api/mounts"
    $data = $response
} else {
    $jsonPart = $content.Substring($jsonStart)
    $data = $jsonPart | ConvertFrom-Json
}

Write-Host "Total mounts: $($data.results.Count)"

$raidMountsList = @()
foreach ($mount in $data.results) {
    $sources = $mount.sources
    if ($null -eq $sources) { continue }
    
    $srcArray = if ($sources -is [System.Collections.IEnumerable] -and -not ($sources -is [string])) {
        @($sources)
    } else {
        @($sources)
    }
    
    foreach ($src in $srcArray) {
        if ($null -ne $src -and ($src.type -eq "Raid" -or $src.text -like "*Savage*" -or $src.text -like "*Coil*")) {
            $raidMountsList += [PSCustomObject]@{
                Id = $mount.id
                Name = $mount.name
                Patch = $mount.patch
                SourceText = $src.text
                SourceType = $src.type
                InstanceId = $src.related_id
            }
        }
    }
}

Write-Host "Raid source entries: $($raidMountsList.Count)"
$raidMountsList | ForEach-Object {
    Write-Host "MountID=$($_.Id) | Name=$($_.Name) | Patch=$($_.Patch) | Source=$($_.SourceText) | Type=$($_.SourceType) | InstanceId=$($_.InstanceId)"
}
